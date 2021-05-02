import * as React from 'react';
import AsyncAutocomplete from "../../../components/AsyncAutocomplete";
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";
import {Grid, Typography} from "@material-ui/core";
import useHttpHandle from "../../../hooks/useHttpHandle";
import genreHttp from "../../../util/http/genre-http";

interface GenreFieldsProps {

}

const GenreField: React.FC<GenreFieldsProps> = (props) => {
    const autoCompleteHttp = useHttpHandle();
    const fetchOptions = (searchText) => autoCompleteHttp(
        genreHttp
            .list({
                queryParams: {
                    search: searchText,
                    all: ''
                }})
    ).then(data => data.data);

    return (
        <>
            <AsyncAutocomplete
                fetchOptions={fetchOptions}
                AutocompleteProps={{
                    freeSolo: true,
                    getOptionLabel: option => option.name
                }}
                TextFieldProps={{
                    label: 'Gêneros'
                }}
            />
            <GridSelected>
                <GridSelectedItem onClick={() => {console.log("clicou")} }>
                    <Typography>
                        Gênero 1 Gênero 1
                    </Typography>
                </GridSelectedItem>
            </GridSelected>
        </>
    );
};

export default GenreField;