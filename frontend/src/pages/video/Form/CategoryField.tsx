import * as React from 'react';
import AsyncAutocomplete from "../../../components/AsyncAutocomplete";
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";
import {Grid, Typography} from "@material-ui/core";
import useHttpHandle from "../../../hooks/useHttpHandle";
import categoryHttp from "../../../util/http/category-http";
import useCollectionManager from "../../../hooks/useCollectionManager";
import {Genre} from "../../../util/models";


interface CategoryFieldsProps {
    categories: any[],
    setCategories: (categories) => void,
    genres: Genre[]
}

const CategoryField: React.FC<CategoryFieldsProps> = (props) => {
    const {categories, setCategories, genres} = props;
    const autoCompleteHttp = useHttpHandle();
    const {addItem, removeItem} = useCollectionManager(categories, setCategories);

    const fetchOptions = (searchText) => autoCompleteHttp(
        categoryHttp
            .list({
                queryParams: {
                    genres: genres.map(genre => genre.id).join(','),
                    all: ''
                }})
    ).then(data => data.data);

    return (
        <>
            <AsyncAutocomplete
                fetchOptions={fetchOptions}
                AutocompleteProps={{
                    getOptionLabel: option => option.name,
                    onChange: (event, value) => addItem(value),
                    disabled: !genres.length
                }}
                TextFieldProps={{
                    label: 'Categorias'
                }}
            />
            <GridSelected>
                {
                    categories.map((category, key) => (
                        <GridSelectedItem key={key} onClick={ () => {
                            console.log("clicou")
                        }} xs={12}>
                            <Typography noWrap={true}>
                                {category.name}
                            </Typography>
                        </GridSelectedItem>
                    ))
                }
            </GridSelected>
        </>
    );
};

export default CategoryField;