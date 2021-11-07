import * as React from 'react';
import MUIDataTable from "mui-datatables";
import {useContext, useEffect, useRef, useState} from "react";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import {Chip, IconButton, MuiThemeProvider} from "@material-ui/core";
import {CastMember, CastMemberTypeMap, Category, Genre, ListResponse} from "../../util/models";
import DefaultTable, {makeActionStyles, MuiDataTableRefComponent, TableColumn} from "../../components/Table";
import {Link} from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import {useSnackbar} from "notistack";
import useFilter from "../../hooks/useFilter";
import * as yup from "../../util/vendor/yup";
import {FilterResetButton} from "../../components/Table/FilterResetButton";
import genreHttp from "../../util/http/genre-http";
import categoryHttp from "../../util/http/category-http";
import {invert} from "lodash";
import LoadingContext from "../../components/loading/LoadingContext";

const columnsDefinition: TableColumn[] = [
    {
        name: 'id',
        label: 'ID',
        width: '30%',
        options: {
            sort: false,
            filter: false,
        }
    },
    {
        name: 'name',
        label: 'Nome',
        width: '23%',
        options: {
            filter: false,
        }
    },
    {
        name: 'is_active',
        label: 'Ativo?',
        width: '4%',
        options: {
            filter: false,
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <Chip label="Sim" color="primary" /> : <Chip label="Não" color="secondary"/>;
            }
        }
    },
    {
        name: 'categories',
        label: 'Categorias',
        width: '20%',
        options: {
            filterType: 'multiselect',
            filterOptions: {
                names: []
            },
            customBodyRender(value, tableMeta, updateValue) {
                return value.map(value => value.name).join(", ");
            }
        }
    },
    {
        name: 'created_at',
        label: 'Criado em',
        width: '10%',
        options: {
            sort: false,
            filter: false,
            customBodyRender(value, tableMeta, updateValue) {
                return <span>{format(parseISO(value), "dd/MM/yyyy")}</span>;
            }
        }
    },
    {
        name: 'actions',
        label: 'Ações',
        width: '13%',
        options: {
            sort: false,
            filter: false,
            customBodyRender(value, tableMeta, updateValue): JSX.Element {
                return (
                    <IconButton
                        color={'secondary'}
                        component={Link}
                        to={`/genres/${tableMeta.rowData[0]}/edit`}
                    >
                        <EditIcon/>
                    </IconButton>
                );
            }
        }
    }
];

const debouncedTime = 300;
const debouncedSearchTime = 300;
const rowsPerPage = 10;
const rowsPerPageOptions = [10, 25, 50];

const Table = () => {
    const snackbar = useSnackbar();
    const subscribed = useRef(true);
    const [data, setData] = useState<Genre[]>([]);
    const loading = useContext(LoadingContext);
    const [categories, setCategories] = useState<Category[]>();
    const tableRef = useRef() as React.MutableRefObject<MuiDataTableRefComponent>;
    const {
        columns,
        filterManager,
        cleanSearchText,
        filterState,
        debouncedFilterState,
        dispatch,
        totalRecords,
        setTotalRecords
    } = useFilter({
        columns: columnsDefinition,
        debounceTime: debouncedTime,
        rowsPerPage,
        rowsPerPageOptions,
        tableRef,
        extraFilter: {
            createValidationSchema: () => {
                return yup.object().shape({
                    categories: yup.mixed()
                        .nullable()
                        .transform(value => {
                            return !value || value === '' ? undefined : value.split(',');
                        })
                        .default(null)
                })
            },
            formatSearchParams: (debouncedState) => {
                return debouncedState.extraFilter
                    ? {
                        ...(
                            debouncedState.extraFilter.categories &&
                            {categories: debouncedState.extraFilter.categories.join(',')}
                        )
                    }
                    : undefined
            },
            getStateFromUrl: (queryParams) => {
                return {
                    categories: queryParams.get('categories')
                }
            }
        }
    });

    const indexColumnCategories = columns.findIndex(c => c.name === 'categories');
    const columnCategories = columns[indexColumnCategories];
    const categoriesFilterValue = filterState.extraFilter && filterState.extraFilter.categories;
    (columnCategories.options as any).filterList = categoriesFilterValue ? categoriesFilterValue : [];
    const serverSideFilterList = columns.map(column => []);
    if (categoriesFilterValue) {
        serverSideFilterList[indexColumnCategories] = categoriesFilterValue;
    }

    useEffect(() => {
        let isSubscrible = true;
        (async () => {
            try {
                const {data} = await categoryHttp.list({queryParams: {all: ''}});
                if (isSubscrible) {
                    setCategories(data.data);
                    (columnCategories.options as any).filterOptions.names = data.data.map(category => category.name)
                }
            } catch (error) {
                console.error(error);
                snackbar.enqueueSnackbar(
                    'Não foi possível carregar as informações',
                    {variant: 'error',}
                )
            }
        })();

        return () => {
            isSubscrible = false;
        }
    }, []);

    //component did mount
    useEffect(() => {
        subscribed.current = true; //evita memory leak
        getData();
        return () => {
            subscribed.current = false;
        }
    }, [
        cleanSearchText(debouncedFilterState.search),
        debouncedFilterState.pagination.page,
        debouncedFilterState.pagination.per_page,
        debouncedFilterState.order,
        JSON.stringify(debouncedFilterState.extraFilter)
    ]);

    async function getData() {
        try {
            const {data} = await genreHttp.list<ListResponse<Genre>>({
                queryParams: {
                    // filter: filterState.filter,
                    search: cleanSearchText(debouncedFilterState.search),
                    page: debouncedFilterState.pagination.page,
                    per_page: debouncedFilterState.pagination.per_page,
                    sort: debouncedFilterState.order.sort,
                    dir: debouncedFilterState.order.dir,
                    ...(
                        debouncedFilterState.extraFilter &&
                        debouncedFilterState.extraFilter.categories &&
                        {
                            categories: debouncedFilterState.extraFilter.categories.join(',')
                        }
                    )
                }
            });
            if (subscribed.current) {
                setData(data.data);
                setTotalRecords(data.meta.total);
            }
        } catch (error) {
            console.log(error);
            if (genreHttp.isCanceledRequest(error)) {
                return;
            }
            snackbar.enqueueSnackbar(
                'Não foi possível carregar as informações',
                {variant: "error"})
        }
    }

    return (
        <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length - 1)}>
            <DefaultTable
                title="Tabela de gêneros"
                columns={columns}
                data={data}
                loading={loading}
                debouncedSearchTime={debouncedSearchTime}
                ref={tableRef}
                options={{
                    serverSideFilterList,
                    serverSide: true,
                    responsive: "scrollMaxHeight",
                    searchText: filterState.search as any,
                    page: filterState.pagination.page - 1,
                    rowsPerPage: filterState.pagination.per_page,
                    rowsPerPageOptions,
                    count: totalRecords,
                    onFilterChange: (column, filterList, type) => {
                        const columnIndex = columns.findIndex(c => c.name === column)
                        filterManager.changeExtraFilter({
                            [column] : filterList[columnIndex].length ? filterList[columnIndex] : null
                        })
                    },
                    customToolbar: () => (
                        <FilterResetButton handleClick={() => filterManager.resetFilter()}/>
                    ),
                    onSearchChange: (value) => filterManager.changeSearch(value),
                    onChangePage: (page) => filterManager.changePage(page),
                    onChangeRowsPerPage: (perPage) => filterManager.changeRowsPerPage(perPage),
                    onColumnSortChange: (changedColumn: string, direction: string) =>
                        filterManager.changeColumnSortChange(changedColumn, direction
                        )
                }}
            />
        </MuiThemeProvider>
    );
};

export default Table;