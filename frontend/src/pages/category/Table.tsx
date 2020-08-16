import * as React from 'react';
import MUIDataTable, {MUIDataTableColumn} from "mui-datatables";
import {useEffect, useState} from "react";
import {httpVideo} from "../../util/http";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import categoryHttp from "../../util/http/category-http";
import {BadgeNo, BadgeYes} from "../../components/Badge";

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
                return value ? <BadgeYes /> : <BadgeNo /> ;
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

const data = [
    {name: "teste1", is_active: true, created_at: "2019-01-02"},
    {name: "teste2", is_active: true, created_at: "2020-01-02"},
    {name: "teste3", is_active: false, created_at: "2019-06-19"},
    {name: "teste4", is_active: true, created_at: "2019-03-02"}
];

interface Category{
    id: string;
    name: string;
}

type Props = {

};
const Table = (props: Props) => {

    const [data, setData] = useState<Category[]>([]);

    //component did mount
    useEffect(() => {
        categoryHttp
            .list<{data: Category[]}>()
            .then(({data}) => setData(data.data))
        // httpVideo.get('categories').then(
        //     response => setData(response.data.data)
        // )
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