import * as React from 'react';
import MUIDataTable, {MUIDataTableColumn} from "mui-datatables";
import {useEffect, useState} from "react";
import {httpVideo} from "../../util/http";

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name: 'name',
        label: 'Nome',
    },
    {
        name: 'is_active',
        label: 'Ativo?',
    },
    {
        name: 'created_at',
        label: 'Criado em',
    }
];

const data = [
    {name: "teste1", is_active: true, created_at: "2019-01-02"},
    {name: "teste2", is_active: true, created_at: "2020-01-02"},
    {name: "teste3", is_active: false, created_at: "2019-06-19"},
    {name: "teste4", is_active: true, created_at: "2019-03-02"}
];

type Props = {

};
const Table = (props: Props) => {

    const [data, setData] = useState([]);

    //component did mount
    useEffect(() => {
        httpVideo.get('categories').then(
            response => setData(response.data.data)
        )
    }, []);

    return (
        <div>
            <MUIDataTable
                title="Tabela de categorias"
                columns={columnsDefinition}
                data={data}
            />
        </div>
    );
};

export default Table;