import * as React from 'react';
import MUIDataTable, {MUIDataTableColumn, MUIDataTableOptions, MUIDataTableProps} from "mui-datatables";
import {merge, omit, cloneDeep} from 'lodash';
import {MuiThemeProvider, Theme, useMediaQuery, useTheme} from "@material-ui/core";

export interface TableColumn extends MUIDataTableColumn {
    width?: string
}

const defaultOptions: MUIDataTableOptions = {
    print: false,
    download: false,
    textLabels: {
        body: {
            noMatch: "Nenhum registro encontrado",
            toolTip: "Classificar",
        },
        pagination: {
            next: "Próxima página",
            previous: "Página anterior",
            rowsPerPage: "Por página",
            displayRows: "de",
        },
        toolbar: {
            search: "Busca",
            downloadCsv: "Download CSV",
            print: "Imprimir",
            viewColumns: "Ver colunas",
            filterTable: "Filtrar tabelas",
        },
        filter: {
            all: "Todos",
            title: "Filtro",
            reset: "Limpar",
        },
        viewColumns: {
            title: "Ver colunas",
            titleAria: "Ver/Esconder colunas da tabela",
        },
        selectedRows: {
            text: "Registros selecionados",
            delete: "Excluir",
            deleteAria: "Excluir registros selecionados",
        },
    }
};

export interface TableProps extends MUIDataTableProps {
    columns: TableColumn[];
    loading?: boolean;
}

const Table: React.FC<TableProps> = (props) => {
    function extractMuiDataTableColumns(columns: TableColumn[]) {
        setColumnsWidth(columns);
        return columns.map(column => omit(column, 'width'))
    }

    function setColumnsWidth(columns: TableColumn[]) {
        columns.forEach((column, key) => {
            const overrides = theme.overrides as any;
            if (column.width) {
                overrides.MUIDataTableHeadCell.fixedHeader[`&:nth-child(${key + 2})`] = {
                    width: column.width
                }
            }
        })
    }

    function applyLoading() {
        const textLabels = (newProps.options as any).textLabels;
        textLabels.body.noMatch =
            newProps.loading === true
                ? 'Carregando...'
                : textLabels.body.noMatch;
    }

    function applyResponsive() {
        //newProps.options.responsive = isSmOrDown ? 'scrollMaxHeight' : 'stacked';
        newProps.options.responsive = isSmOrDown ? 'vertical' : 'simple';
    }

    function getOriginalMuiDataTableProps() {
        return omit(newProps, 'loading');
    }

    const theme = cloneDeep<Theme>(useTheme());
    const isSmOrDown = useMediaQuery(theme.breakpoints.down('sm'));

    const newProps = merge(
        {options: cloneDeep(defaultOptions)},
        props,
        {columns: extractMuiDataTableColumns(props.columns)});

    applyLoading();
    applyResponsive();

    const originalProps = getOriginalMuiDataTableProps();

    return (
        <div>
            <MuiThemeProvider theme={theme}>
                <MUIDataTable {...originalProps} />
            </MuiThemeProvider>
        </div>
    );
};

export default Table;

export function makeActionStyles(column) {
    return theme => {
        const copyTheme = cloneDeep(theme);
        const selector = `&[data-testid^="MuiDataTableBodyCell-${column}"]`;
        (copyTheme.overrides as any).MUIDataTableBodyCell.root[selector] = {
            paddingTop: '0px',
            paddingBottom: '0px',
        };
        return copyTheme;
    }
}