import * as React from 'react';
import MUIDataTable from "mui-datatables";
import {useEffect, useState} from "react";
import httpGenre from "../../util/http/genre-http";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import {Chip, IconButton, MuiThemeProvider} from "@material-ui/core";
import {Genre, ListResponse} from "../../util/models";
import {makeActionStyles, TableColumn} from "../../components/Table";
import {Link} from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";

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

type Props = {};

const Table = (props: Props) => {

    const [data, setData] = useState<Genre[]>([]);

    //component did mount
    useEffect(() => {
        let isSubscribed = true;
        (async () => {
            const {data} = await httpGenre.list<ListResponse<Genre>>();
            if(isSubscribed) {
                setData(data.data);
            }
        })();

        return () => {
            isSubscribed = false;
        }
        // httpVideo.get('genres').then(
        //     response => setData(response.data.data)
        // )
    }, []);

    return (
        <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length-1)}>
            <MUIDataTable
                title="Tabela de gêneros"
                columns={columnsDefinition}
                data={data}
            />
        </MuiThemeProvider>
    );
};

export default Table;