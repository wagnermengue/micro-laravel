import * as React from 'react';
import AsyncAutocomplete from "../../../components/AsyncAutocomplete";
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";
import {Grid, Typography} from "@material-ui/core";
import useHttpHandle from "../../../hooks/useHttpHandle";
import genreHttp from "../../../util/http/genre-http";
import useCollectionManager from "../../../hooks/useCollectionManager";

interface GenreFieldsProps {
    genres: any[],
    setGenres: (genres) => void
}

const GenreField: React.FC<GenreFieldsProps> = (props) => {
    const {genres, setGenres} = props;
    const autoCompleteHttp = useHttpHandle();
    const {addItem, removeItem} = useCollectionManager(genres, setGenres);
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
                    getOptionLabel: option => option.name,
                    onChange: (event, value) => addItem(value)
                }}
                TextFieldProps={{
                    label: 'Gêneros'
                }}
            />
            <GridSelected>
                {
                    genres.map((genre, key) => (
                        <GridSelectedItem key={key} onClick={ () => {
                            console.log("clicou")
                        }} xs={12}>
                            <Typography noWrap={true}>
                                {genre.name}
                            </Typography>
                        </GridSelectedItem>
                    ))
                }
            </GridSelected>
        </>
    );
};

export default GenreField;