import {ComponentNameToClassKey} from '@material-ui/core/styles/overrides';
import {Palette, PaletteOptions, PaletteColor} from "@material-ui/core/styles/createPalette";

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
        MUIDataTableFilterList: any;
    }
}

declare module '@material-ui/core/styles/createPalette' {
    import {PaletteColorOptions} from "@material-ui/core/styles";

    interface Palette {
        success: PaletteColor
    }

    interface PaletteOptions {
        success?: PaletteColorOptions
    }
}