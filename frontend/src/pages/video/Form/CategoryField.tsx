import * as React from 'react';
import AsyncAutocomplete from "../../../components/AsyncAutocomplete";
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";
import {Grid, Typography} from "@material-ui/core";
import useHttpHandle from "../../../hooks/useHttpHandle";
import categoryHttp from "../../../util/http/category-http";

interface CategoryFieldsProps {

}

const CategoryField: React.FC<CategoryFieldsProps> = (props) => {
    const autoCompleteHttp = useHttpHandle();
    const fetchOptions = (searchText) => autoCompleteHttp(
        categoryHttp
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
                    label: 'Categorias'
                }}
            />
            <GridSelected>
                <GridSelectedItem onClick={() => {console.log("clicou")} }>
                    <Typography>
                        Categoria 1 Categoria 1
                    </Typography>
                </GridSelectedItem>
            </GridSelected>
        </>
    );
};

export default CategoryField;