import {ComponentNameToClassKey} from '@material-ui/core/styles/overrides';

declare module '@material-ui/core/styles/overrides' {
    interface ComponentNameToClassKey {
        MUIDataTable: any;
        MUIDataTableToolbar: any;
        MUIDataTableToolbarSelect: any;
        MUIDataTableHeadCell: any;
        MUIDataTableSelectCell: any;
        MUIDataTableBodyCell: any;
        MUIDataTableBodyRow: any;
        MuiTableSortLabel: any;
        MUIDataTablePagination: any;
    }
}