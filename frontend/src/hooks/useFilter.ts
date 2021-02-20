import {Dispatch, Reducer, useReducer, useState} from "react";
import reducer, {INITIAL_STATE} from "../store/filter";
import {Actions as FilterActions, State as FilterState} from "../store/filter/types";
import {Creators} from "../store/filter";
import {MUIDataTableColumn, MUIDataTableColumnOptions} from "mui-datatables";
import {useDebounce} from "use-debounce";

interface FilterManagerOptions {
    columns: MUIDataTableColumn[];
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    debounceTime: number;
}

function init(INITIAL_STATE) {
    return INITIAL_STATE;
}

export default function useFilter(options: FilterManagerOptions) {

    const filterManager = new FilterManager(options)
    //pegar o state da URL
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [filterState, dispatch] = useReducer(reducer, INITIAL_STATE, init);
    const [debouncedFilterState] = useDebounce(filterState, options.debounceTime);
    // const [filterState, dispatch] = useReducer<Reducer<FilterState, FilterActions>>(reducer, INITIAL_STATE, init);

    // filterManager.state = <FilterState>filterState;
    filterManager.dispatch = dispatch;
    filterManager.applyOrderInColumns();

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

    state: FilterState = null as any;
    dispatch: Dispatch<FilterActions> = null as any;
    columns: ({name: string; options?: MUIDataTableColumnOptions; label?: string; order: { sortDirection: string | null; name: string; options?: MUIDataTableColumnOptions; label?: string } } | MUIDataTableColumn)[];
    rowsPerPage: number;
    rowsPerPageOptions: number[];

    constructor(options: FilterManagerOptions) {
        const {columns, rowsPerPage, rowsPerPageOptions, debounceTime} = options;
        this.columns = columns;
        this.rowsPerPage = rowsPerPage;
        this.rowsPerPageOptions = rowsPerPageOptions;
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
            if (this.state) {
                //debugger;
                return column.name === this.state.order.sort
                    ? {
                        ...column,
                        order: {
                            ...column,
                            sortDirection: this.state.order.dir
                        }
                    }
                    : column
            }
            return column
        });
    }

    cleanSearchText(text) {
        let newText = text
        if (text && text.value !== undefined) {
            newText = text.value;
        }
        return newText;
    }
}