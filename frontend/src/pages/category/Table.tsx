import * as React from 'react';
import MUIDataTable, {MUIDataTableColumn} from "mui-datatables";
import {useEffect, useState} from "react";
import {httpVideo} from "../../util/http";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import categoryHttp from "../../util/http/category-http";
import {BadgeNo, BadgeYes} from "../../components/Badge";
import {Category, ListResponse} from "../../util/models";
import DefaultTable, {TableColumn} from '../../components/Table';

const columnsDefinition: TableColumn[] = [
    {
        name: 'id',
        label: 'ID',
        options: {
            sort: false
        },
        width: '30%',
    },
    {
        name: 'name',
        label: 'Nome',
        width: '40%',
    },
    {
        name: 'is_active',
        label: 'Ativo?',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <BadgeYes /> : <BadgeNo /> ;
            }
        },
        width: '4%',
    },
    {
        name: 'created_at',
        label: 'Criado em',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return <span>{format(parseISO(value), "dd/MM/yyyy")}</span>;
            }
        },
        width: '10%',
    },
    {
        name: 'actions',
        label: 'Ações',
        width: '13%',
    }
];

type Props = {

};
const Table = (props: Props) => {

    const [data, setData] = useState<Category[]>([]);

    //component did mount
    useEffect(() => {
        let isSubscribed = true;
        (async () => {
            const {data} = await categoryHttp.list<ListResponse<Category>>();
            if(isSubscribed) {
                setData(data.data);
            }
        })();

        return () => {
            isSubscribed = false;
        }
        // categoryHttp
        //     .list<{data: Category[]}>()
        //     .then(({data}) => setData(data.data))

        // httpVideo.get('categories').then(
        //     response => setData(response.data.data)
        // )
    }, []);

    return (
        <div>
            <DefaultTable
                title="Tabela de categorias"
                columns={columnsDefinition}
                data={data}
            />
        </div>
    );
};

export default Table;