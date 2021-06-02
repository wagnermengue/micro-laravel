import * as React from 'react';
import AsyncAutocomplete from "../../../components/AsyncAutocomplete";
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";
import {FormControl, Grid, Typography, FormControlProps, FormHelperText} from "@material-ui/core";
import useHttpHandle from "../../../hooks/useHttpHandle";
import genreHttp from "../../../util/http/genre-http";
import useCollectionManager from "../../../hooks/useCollectionManager";

interface GenreFieldsProps {
    genres: any[],
    setGenres: (genres) => void,
    error: any,
    disabled?: boolean,
    FormControlProps?: FormControlProps
}

const GenreField: React.FC<GenreFieldsProps> = (props) => {
    const {genres, setGenres, error, disabled} = props;
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
                    autoSelect: true,
                    clearOnEscape: true,
                    //getOptionSelected: (option, value) => option.id === value.id, (alternativa ao autoSelect)
                    freeSolo: true,
                    getOptionLabel: option => option.name,
                    onChange: (event, value) => addItem(value),
                    disabled
                }}
                TextFieldProps={{
                    label: 'Gêneros',
                    error: error != undefined
                }}
            />
            <FormControl
                margin="normal"
                fullWidth
                error={error !== undefined}
                disabled={disabled === true}
                {...props.FormControlProps}
            >
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
                {
                    error && <FormHelperText>{error.message}</FormHelperText>
                }
            </FormControl>
        </>
    );
};

export default GenreField;