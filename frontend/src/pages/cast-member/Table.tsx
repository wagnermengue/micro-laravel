import * as React from 'react';
import MUIDataTable from "mui-datatables";
import {useEffect, useState} from "react";
import {httpVideo} from "../../util/http";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import {CastMember, ListResponse} from "../../util/models";
import {makeActionStyles, TableColumn} from "../../components/Table";
import {IconButton, MuiThemeProvider} from "@material-ui/core";
import {Link} from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";

const CastMemberTypeMap = {
    1: 'Diretor',
    2: 'Ator',
}

const columnsDefinition: TableColumn[] = [
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
                        to={`/cast-members/${tableMeta.rowData[0]}/edit`}
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
        <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length-1)}>
            <MUIDataTable
                title="Tabela de membros de elencos"
                columns={columnsDefinition}
                data={data}
            />
        </MuiThemeProvider>
    );
};

export default Table;