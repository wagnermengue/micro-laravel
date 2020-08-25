import * as React from 'react';
import MUIDataTable, {MUIDataTableColumn} from "mui-datatables";
import {useEffect, useState} from "react";
import {httpVideo} from "../../util/http";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import {CastMember, ListResponse} from "../../util/models";

const CastMemberTypeMap = {
    1: 'Diretor',
    2: 'Ator',
}

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name: 'name',
        label: 'Nome',
    },
    {
        name: 'type',
        label: 'Tipo',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return CastMemberTypeMap[value];
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

    const [data, setData] = useState<CastMember[]>([]);

    //component did mount
    useEffect(() => {
        let isSubscribed = true;
        (async () => {
            const {data} = await httpVideo.get<ListResponse<CastMember>>('cast_members');
            if(isSubscribed) {
                setData(data.data);
            }
        })();

        return () => {
            isSubscribed = false;
        }
    }, []);

    return (
        <div>
            <MUIDataTable
                title="Tabela de membros de elencos"
                columns={columnsDefinition}
                data={data}
            />
        </div>
    );
};

export default Table;