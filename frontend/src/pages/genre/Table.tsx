import * as React from 'react';
import MUIDataTable, {MUIDataTableColumn} from "mui-datatables";
import {useEffect, useState} from "react";
import httpGenre from "../../util/http/genre-http";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import {Chip} from "@material-ui/core";

const columnsDefinition: MUIDataTableColumn[] = [
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
    }
];

type Props = {};

const Table = (props: Props) => {

    const [data, setData] = useState([]);

    //component did mount
    useEffect(() => {
        let isSubscribed = true;
        (async () => {
            const {data} = await httpGenre.list();
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
        <div>
            <MUIDataTable
                title="Tabela de gêneros"
                columns={columnsDefinition}
                data={data}
            />
        </div>
    );
};

export default Table;