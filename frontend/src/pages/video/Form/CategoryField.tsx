import * as React from 'react';
import AsyncAutocomplete, {AsyncAutocompleteComponent} from "../../../components/AsyncAutocomplete";
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";
import {FormHelperText, Typography, FormControlProps, FormControl, makeStyles, Theme} from "@material-ui/core";
import useHttpHandle from "../../../hooks/useHttpHandle";
import categoryHttp from "../../../util/http/category-http";
import useCollectionManager from "../../../hooks/useCollectionManager";
import {Genre} from "../../../util/models";
import {getGenresFromCategory} from "../../../util/models-filters";
import {grey} from "@material-ui/core/colors";
import {MutableRefObject, RefAttributes, useImperativeHandle, useRef} from "react";

const useStyles = makeStyles((theme: Theme) => ({
    genresSubtitle: {
        fontSize: '0.8rem',
        color: grey['800']
    }
}));

interface CategoryFieldsProps extends RefAttributes<CategoryFieldComponent>{
    categories: any[],
    setCategories: (categories) => void,
    genres: Genre[],
    error: any,
    disabled?: boolean,
    FormControlProps?: FormControlProps
}

export interface CategoryFieldComponent {
    clear: () => void
}

const CategoryField = React.forwardRef<CategoryFieldComponent, CategoryFieldsProps>((props, ref) => {
    const {categories, setCategories, genres, error, disabled} = props;
    const classes = useStyles();
    const autoCompleteHttp = useHttpHandle();
    const {addItem, removeItem} = useCollectionManager(categories, setCategories);
    const autoCompleteRef = useRef() as MutableRefObject<AsyncAutocompleteComponent>;

    const fetchOptions = (searchText) => autoCompleteHttp(
        categoryHttp
            .list({
                queryParams: {
                    genres: genres.map(genre => genre.id).join(','),
                    all: ''
                }})
    ).then(data => data.data);

    useImperativeHandle(ref, () => ({
        clear: () => autoCompleteRef.current.clear()
    }));

    return (
        <>
            <AsyncAutocomplete
                ref={autoCompleteRef}
                fetchOptions={fetchOptions}
                AutocompleteProps={{
                    getOptionLabel: option => option.name,
                    onChange: (event, value) => addItem(value),
                    disabled: !genres.length || disabled === true
                }}
                TextFieldProps={{
                    label: 'Categorias',
                    error: error !== undefined
                }}
            />
            <FormHelperText style={{height: '24px'}}>
                Escola pelo menos uma categoria de cada gênero
            </FormHelperText>
            <FormControl
                margin="normal"
                fullWidth
                error={error !== undefined}
                disabled={disabled === true}
                {...props.FormControlProps}
            >
            <GridSelected>
                {
                    categories.map((category, key) => {
                        const genresFromCategory = getGenresFromCategory(genres, category)
                            .map(genre => genre.name).join(',');
                        return (
                            <GridSelectedItem
                                key={key}
                                onDelete={() => {
                                    removeItem(category)
                                }}
                                xs={12}>
                                <Typography noWrap={true}>
                                    {category.name}
                                </Typography>
                                <Typography noWrap={true} className={classes.genresSubtitle}>
                                    Generos: {genresFromCategory}
                                </Typography>
                            </GridSelectedItem>
                        )
                    })
                    }
                </GridSelected>
                {
                    error && <FormHelperText>{error.message}</FormHelperText>
                }
            </FormControl>
        </>
    );
});

export default CategoryField;