import * as React from 'react';
import {useEffect, useReducer, useRef, useState} from "react";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import categoryHttp from "../../util/http/category-http";
import {BadgeNo, BadgeYes} from "../../components/Badge";
import {Category, ListResponse} from "../../util/models";
import DefaultTable, {makeActionStyles, TableColumn} from '../../components/Table';
import {useSnackbar} from "notistack";
import {IconButton, MuiThemeProvider, Theme} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import {Link} from "react-router-dom";
import {FilterResetButton} from "../../components/Table/FilterResetButton";

const columnsDefinition: TableColumn[] = [
    {
        name: 'id',
        label: 'ID',
        options: {
            sort: false
        },
        width: '30%',
    },
    {
        name: 'name',
        label: 'Nome',
        width: '40%',
    },
    {
        name: 'is_active',
        label: 'Ativo?',
        options: {
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
            }
        },
        width: '10%',
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
                        to={`/categories/${tableMeta.rowData[0]}/edit`}
                    >
                        <EditIcon/>
                    </IconButton>
                );
            }
        }
    }
];

const INITIAL_STATE = {
    search: '',
    pagination: {
        page: 1,
        per_page: 10,
        total: 0
    },
    order: {
        sort: null,
        dir: null
    }
};

function init(INITIAL_STATE) {
    return INITIAL_STATE;
}

function reducer(state, action) {
    switch (action.type) {
        case 'search':
            return {
                ...state,
                search: action.search,
                pagination: {
                    ...state.pagination,
                    page: 1
                }
            };
        case 'page':
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    page: action.page
                }
            };
        case 'per_page':
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    page: action.per_page
                }
            };
        case 'order':
            return {
                ...state,
                order: {
                    sort: action.sort,
                    dir: action.dir
                }
            };
        case 'reset':
        default:
            return INITIAL_STATE;
    }
}

const Table = () => {
    const snackbar = useSnackbar();
    const subscribed = useRef(true);
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchState, dispatch] = useReducer(reducer, INITIAL_STATE, init);
    //const [searchState, setSearchState] = useState<SearchState>(initialState);

    const columns = columnsDefinition.map(column => {
        return column.name === searchState.order.sort
        ? {
            ...column,
            order: {
                ...column,
                sortDirection: searchState.order.dir
            }
        }
        : column
    });

    //component did mount
    useEffect(() => {
        subscribed.current = true; //evita memory leak
        getData();
        return () => {
            subscribed.current = false;
        }
    }, [
        searchState.search,
        searchState.pagination.page,
        searchState.pagination.per_page,
        searchState.order
    ]);

    async function getData() {
        setLoading(true);
        try {
            const {data} = await categoryHttp.list<ListResponse<Category>>({
                queryParams: {
                    search: searchState.search,
                    page: searchState.pagination.page,
                    per_page: searchState.pagination.per_page,
                    sort: searchState.order.sort,
                    dir: searchState.order.dir,
                }
            });
            if (subscribed.current) {
                setData(data.data);
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
        } finally {
            setLoading(false)
        }
    }


    return (
        <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length - 1)}>
            <DefaultTable
                title="Tabela de categorias"
                columns={columns}
                data={data}
                loading={loading}
                options={{
                    serverSide: true,
                    searchText: searchState.search,
                    page: searchState.pagination.page - 1,
                    rowsPerPage: searchState.pagination.per_page,
                    count: searchState.pagination.total,
                    // customToolbar: () => (
                    //     <FilterResetButton handleClick={dispatch({type: 'reset')}/>
                    // ),
                    onSearchChange: (value) => dispatch({type: 'search', search: value}),
                    onChangePage: (page) => dispatch({type: 'search', page: page + 1}),
                    onChangeRowsPerPage: (perPage) => dispatch({type: 'search', page: perPage}),
                    onColumnSortChange: (changedColumn: string, direction: string) => dispatch({
                        type: 'order',
                        sort: changedColumn,
                        dir: direction.includes('desc') ? 'desc' : 'asc'
                    }),
                }}
            />
        </MuiThemeProvider>
    );
};

export default Table;