import * as React from 'react';
import {useEffect, useReducer, useRef, useState} from "react";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import categoryHttp from "../../util/http/category-http";
import {BadgeNo, BadgeYes} from "../../components/Badge";
import {Category, ListResponse} from "../../util/models";
import DefaultTable, {makeActionStyles, TableColumn} from '../../components/Table';
import {useSnackbar} from "notistack";
import {debounce, IconButton, MuiThemeProvider, Theme} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import {Link} from "react-router-dom";
import {FilterResetButton} from "../../components/Table/FilterResetButton";
import useFilter from "../../hooks/useFilter";
import {Creators} from "../../store/filter";

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

const Table = () => {
    const snackbar = useSnackbar();
    const subscribed = useRef(true);
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const {
        columns,
        filterManager,
        filterState,
        dispatch,
        totalRecords,
        setTotalRecords
    } = useFilter({
        columns: columnsDefinition,
        debounceTime: 500,
        rowsPerPage: 10,
        rowsPerPageOptions: [10, 25, 50]
    });

    //component did mount
    useEffect(() => {
        subscribed.current = true; //evita memory leak
        getData();
        return () => {
            subscribed.current = false;
        }
    }, [
        filterState.search,
        filterState.pagination.page,
        filterState.pagination.per_page,
        filterState.order
    ]);

    async function getData() {
        setLoading(true);
        try {
            const {data} = await categoryHttp.list<ListResponse<Category>>({
                queryParams: {
                    // filter: filterState.filter,
                    search: cleanSearchText(filterState.search),
                    page: filterState.pagination.page,
                    per_page: filterState.pagination.per_page,
                    sort: filterState.order.sort,
                    dir: filterState.order.dir,
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
        } finally {
            setLoading(false)
        }
    }

    function cleanSearchText(text) {
        let newText = text
        if (text && text.value !== undefined) {
            newText = text.value;
        }
        return newText;
    }


    return (
        <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length - 1)}>
            <DefaultTable
                title="Tabela de categorias"
                columns={columns}
                data={data}
                loading={loading}
                debouncedSearchTime={500}
                options={{
                    serverSide: true,
                    responsive: "scrollMaxHeight",
                    searchText: filterState.search as any,
                    page: filterState.pagination.page - 1,
                    rowsPerPage: filterState.pagination.per_page,
                    count: totalRecords,
                    customToolbar: () => (
                        <FilterResetButton handleClick={() => dispatch(Creators.setReset())}/>
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
}

export default Table;