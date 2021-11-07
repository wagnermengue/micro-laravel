import * as React from 'react';
import {useContext, useEffect, useReducer, useRef, useState} from "react";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import categoryHttp from "../../util/http/category-http";
import {BadgeNo, BadgeYes} from "../../components/Badge";
import {Category, ListResponse} from "../../util/models";
import DefaultTable, {makeActionStyles, MuiDataTableRefComponent, TableColumn} from '../../components/Table';
import {useSnackbar} from "notistack";
import {debounce, IconButton, MuiThemeProvider, Theme} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import {Link} from "react-router-dom";
import {FilterResetButton} from "../../components/Table/FilterResetButton";
import useFilter from "../../hooks/useFilter";
import {Creators} from "../../store/filter";
import LoadingContext from "../../components/loading/LoadingContext";

const columnsDefinition: TableColumn[] = [
    {
        name: 'id',
        label: 'ID',
        options: {
            sort: false,
            filter: false,
        },
        width: '30%',
    },
    {
        name: 'name',
        label: 'Nome',
        width: '40%',
        options: {
            filter: false
        }
    },
    {
        name: 'is_active',
        label: 'Ativo?',
        options: {
            filterOptions: {
                names: ['Sim', 'Não']
            },
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <BadgeYes/> : <BadgeNo/>;
            }
        },
        width: '4%',
    },
    {
        name: 'created_at',
        label: 'Criado em',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return <span>{format(parseISO(value), "dd/MM/yyyy")}</span>;
            },
            filter: false,
        },
        width: '10%',
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
                        to={`/categories/${tableMeta.rowData[0]}/edit`}
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
    const [data, setData] = useState<Category[]>([]);
    const loading = useContext(LoadingContext);
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
        tableRef
    });

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
        debouncedFilterState.order
    ]);

    async function getData() {
        try {
            const {data} = await categoryHttp.list<ListResponse<Category>>({
                queryParams: {
                    // filter: filterState.filter,
                    search: cleanSearchText(debouncedFilterState.search),
                    page: debouncedFilterState.pagination.page,
                    per_page: debouncedFilterState.pagination.per_page,
                    sort: debouncedFilterState.order.sort,
                    dir: debouncedFilterState.order.dir,
                }
            });
            if (subscribed.current) {
                setData(data.data);
                setTotalRecords(data.meta.total);
                // setSearchState((prevState => ({
                //     ...prevState,
                //     pagination: {
                //         ...prevState.pagination,
                //         total: data.meta.total
                //     }
                // })))
            }
        } catch (error) {
            console.log(error);
            if (categoryHttp.isCanceledRequest(error)) {
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
                title="Tabela de categorias"
                columns={columns}
                data={data}
                loading={loading}
                debouncedSearchTime={debouncedSearchTime}
                ref={tableRef}
                options={{
                    //serverSideFilterList: [[], ['teste'], ['teste'], []],
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