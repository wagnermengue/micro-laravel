import * as React from 'react';
import AsyncAutocomplete from "../../../components/AsyncAutocomplete";
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";
import {FormControl, Grid, Typography, FormControlProps, FormHelperText} from "@material-ui/core";
import useHttpHandle from "../../../hooks/useHttpHandle";
import genreHttp from "../../../util/http/genre-http";
import useCollectionManager from "../../../hooks/useCollectionManager";
import {getGenresFromCategory} from "../../../util/models-filters";

interface GenreFieldsProps {
    genres: any[],
    setGenres: (genres) => void,
    categories: any[],
    setCategories: (categories) => void,
    error: any,
    disabled?: boolean,
    FormControlProps?: FormControlProps
}

const GenreField: React.FC<GenreFieldsProps> = (props) => {
    const {genres, setGenres, categories, setCategories, error, disabled} = props;
    const autoCompleteHttp = useHttpHandle();
    const {addItem, removeItem} = useCollectionManager(genres, setGenres);
    const {removeItem: removeCategory} = useCollectionManager(categories, setCategories);
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
                            <GridSelectedItem
                                key={key}
                                onDelete={ () => {
                                    const categoriesWithOneGenre = categories
                                        .filter(category => {
                                            const genresFromCategory = getGenresFromCategory(genres, category);
                                            return genresFromCategory.length === 1 && genres[0].id == genre.id;
                                        })
                                    categoriesWithOneGenre.forEach(cat => removeCategory(cat));
                                    removeItem(genre)
                                }}
                                xs={12}>
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