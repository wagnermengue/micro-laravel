import {Dispatch, Reducer, useEffect, useReducer, useState} from "react";
import reducer, {INITIAL_STATE} from "../store/filter";
import {Actions as FilterActions, State as FilterState} from "../store/filter/types";
import {Creators} from "../store/filter";
import {MUIDataTableColumn, MUIDataTableColumnOptions} from "mui-datatables";
import {useDebounce} from "use-debounce";
import {useHistory} from "react-router";
import {History} from "history";
import {isEqual} from 'lodash';
import * as yup from '../util/vendor/yup';

function init(INITIAL_STATE) {
    return INITIAL_STATE;
}

interface FilterManagerOptions {
    columns: MUIDataTableColumn[];
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    debounceTime: number;
    history: History;
}

interface UseFilterOptions extends Omit<FilterManagerOptions, 'history'> {}

export default function useFilter(options: UseFilterOptions) {
    const history = useHistory();
    const filterManager = new FilterManager({...options, history});
    const INITIAL_STATE = filterManager.getStateFromURL();
    const [totalRecords, setTotalRecords] = useState<number>(0);
    // const [filterState, dispatch] = useReducer<Reducer<FilterState, FilterActions>>(reducer, INITIAL_STATE, init);
    const [filterState, dispatch] = useReducer(reducer, INITIAL_STATE, init);
    const [debouncedFilterState] = useDebounce(filterState, options.debounceTime);

    filterManager.state = <FilterState>filterState;
    filterManager.dispatch = dispatch;
    filterManager.applyOrderInColumns();

    useEffect(() => {
        filterManager.replaceHistory()
    },[]);

    return {
        columns: filterManager.columns,
        filterManager,
        filterState,
        debouncedFilterState,
        dispatch,
        totalRecords,
        setTotalRecords
    }
}

export class FilterManager {

    schema;
    state: FilterState = null as any;
    dispatch: Dispatch<FilterActions> = null as any;
    columns: ({name: string; options?: MUIDataTableColumnOptions; label?: string; order: { sortDirection: string | null; name: string; options?: MUIDataTableColumnOptions; label?: string } } | MUIDataTableColumn)[];
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    history: History;

    constructor(options: FilterManagerOptions) {
        const {columns, rowsPerPage, rowsPerPageOptions, history} = options;
        this.columns = columns;
        this.rowsPerPage = rowsPerPage;
        this.rowsPerPageOptions = rowsPerPageOptions;
        this.history = history;
        this.createValidationSchema();
    }

    changeSearch(value){
        this.dispatch(Creators.setSearch({search: value}));
    }

    changePage(page){
        this.dispatch(Creators.setPage({page: page + 1}));
    }

    changeRowsPerPage(perPage) {
        this.dispatch(Creators.setPerPage({per_page: perPage}));
    }

    changeColumnSortChange(changedColumn: string, direction: string) {
        //debugger;
        this.dispatch(Creators.setOrder({
            sort: changedColumn,
            dir: direction.includes('desc') ? 'desc' : 'asc'
        }));
    }

    applyOrderInColumns() {
        this.columns = this.columns.map(column => {
            return column.name === this.state.order.sort
                ? {
                    ...column,
                    order: {
                        ...column,
                        sortDirection: this.state.order.dir
                    }
                }
                : column
        });
    }

    cleanSearchText(text) {
        let newText = text
        if (text && text.value !== undefined) {
            newText = text.value;
        }
        return newText;
    }

    replaceHistory() {
        this.history.replace({
            pathname: this.history.location.pathname,
            search: '?' + new URLSearchParams(this.formatSearchParams() as any),
            state: this.state
        })
    }

    pushHistory() {
        const newLocation = {
            pathname: this.history.location.pathname,
            search: '?' + new URLSearchParams(this.formatSearchParams() as any),
            state: {
                ...this.state,
                search: this.cleanSearchText(this.state.search)
            }
        }
        const oldState = this.history.location.state;
        const nextState = this.state;
        if (isEqual(nextState, oldState)){
            return;
        }
        this.history.push(newLocation);
    }

    private formatSearchParams() {
        const search = this.cleanSearchText(this.state.search);
        return {
            ...(search && search !== '' && {search: search}),
            ...(this.state.pagination.page && this.state.pagination.page !== 1 && {page: this.state.pagination.page}),
            ...(this.state.pagination.per_page && this.state.pagination.per_page !== 10 && {per_page: this.state.pagination.per_page}),
            ...(this.state.order.sort && {
                sort: this.state.order.sort,
                dir: this.state.order.dir,
            })
        }
    }

    getStateFromURL() {
        const queryParams = new URLSearchParams(this.history.location.search.substr(1));
        return this.schema.cast({
            search: queryParams.get('search'),
            pagination: {
                page: queryParams.get('page'),
                per_page: queryParams.get('per_page'),
            },
            order: {
                sort: queryParams.get('sort'),
                dir: queryParams.get('dir'),
            },
        })
    }

    private createValidationSchema() {
        this.schema = yup.object().shape({
            search: yup.string()
                .transform(value => !value ? undefined : value)
                .default(''),
            pagination: yup.object().shape({
                page: yup.number()
                    .transform(value => isNaN(value) || parseInt(value) < 1 ? undefined : value)
                    .default(1),
                per_page: yup.number()
                    .oneOf(this.rowsPerPageOptions)
                    .transform(value => isNaN(value) ? undefined : value)
                    .default(this.rowsPerPage),
            }),
            order: yup.object().shape({
                sort: yup.string()
                    .nullable()
                    .transform(value => {
                        const columnName = this.columns
                            .filter(columns => !columns.options || columns.options.sort !== false)
                            .map(columns => columns.name);
                        return columnName.includes(value) ? value : undefined;
                    })
                    .default(null),
                dir: yup.string()
                    .nullable()
                    .transform(value => !value || !['asc', 'desc'].includes(value.toLowerCase()) ? undefined : value)
                    .default(null),
            }),
        });
    }
}