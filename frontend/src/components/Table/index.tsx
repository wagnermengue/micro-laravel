import * as React from 'react';
import MUIDataTable, {MUIDataTableColumn, MUIDataTableOptions, MUIDataTableProps} from "mui-datatables";
import {merge, omit, cloneDeep} from 'lodash';
import {MuiThemeProvider, Theme, useTheme} from "@material-ui/core";

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

interface TableProps extends MUIDataTableProps {
    columns: TableColumn[];
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

    const theme = cloneDeep<Theme>(useTheme());

    const newProps = merge(
        {options: defaultOptions},
        props,
        {columns: extractMuiDataTableColumns(props.columns)});

    return (
        <div>
            <MuiThemeProvider theme={theme}>
                <MUIDataTable {...newProps} />
            </MuiThemeProvider>
        </div>
    );
};

export default Table;