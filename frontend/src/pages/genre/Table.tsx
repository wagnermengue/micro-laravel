import * as React from 'react';
import MUIDataTable from "mui-datatables";
import {useEffect, useRef, useState} from "react";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import {Chip, IconButton, MuiThemeProvider} from "@material-ui/core";
import {CastMember, Genre, ListResponse} from "../../util/models";
import DefaultTable, {makeActionStyles, MuiDataTableRefComponent, TableColumn} from "../../components/Table";
import {Link} from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import {useSnackbar} from "notistack";
import useFilter from "../../hooks/useFilter";
import * as yup from "../../util/vendor/yup";
import {FilterResetButton} from "../../components/Table/FilterResetButton";
import genreHttp from "../../util/http/genre-http";

const columnsDefinition: TableColumn[] = [
    {
        name: 'name',
        label: 'Nome',
    },
    {
        name: 'is_active',
        label: 'Ativo?',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <Chip label="Sim" color="primary" /> : <Chip label="Não" color="secondary"/>;
            }
        }
    },
    {
        name: 'categories',
        label: 'Categorias',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value.map(value => value.name).join(", ");
            }
        }
    },
    {
        name: 'created_at',
        label: 'Criado em',
        options: {
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
    const [data, setData] = useState<CastMember[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const tableRef = useRef() as React.MutableRefObject<MuiDataTableRefComponent>;
    const {
        columns,
        filterManager,
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

    //component did mount
    useEffect(() => {
        subscribed.current = true; //evita memory leak
        filterManager.pushHistory();
        getData();
        return () => {
            subscribed.current = false;
        }
    }, [
        filterManager.cleanSearchText(debouncedFilterState.search),
        debouncedFilterState.pagination.page,
        debouncedFilterState.pagination.per_page,
        debouncedFilterState.order
    ]);

    async function getData() {
        setLoading(true);
        try {
            const {data} = await genreHttp.list<ListResponse<CastMember>>({
                queryParams: {
                    // filter: filterState.filter,
                    search: filterManager.cleanSearchText(filterState.search),
                    page: filterState.pagination.page,
                    per_page: filterState.pagination.per_page,
                    sort: filterState.order.sort,
                    dir: filterState.order.dir,
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
        } finally {
            setLoading(false)
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
                    serverSide: true,
                    responsive: "scrollMaxHeight",
                    searchText: filterState.search as any,
                    page: filterState.pagination.page - 1,
                    rowsPerPage: filterState.pagination.per_page,
                    rowsPerPageOptions,
                    count: totalRecords,
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