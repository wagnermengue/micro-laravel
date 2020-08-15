import * as React from 'react';
import {Box, Button, Checkbox, ButtonProps, makeStyles, TextField, Theme, MenuItem} from "@material-ui/core";
import {useForm} from "react-hook-form";
import genreHttp from "../../util/http/genre-http";
import {useEffect, useState} from "react";
import categoryHttp from "../../util/http/category-http";

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
});

export const Form = () => {

    const classes = useStyles();

    const buttonProps : ButtonProps = {
        className: classes.submit,
        variant: "outlined"
    }

    const [categories, setCategories] = useState<any[]>([]);
    const {register, handleSubmit, getValues, setValue, watch} = useForm({
        defaultValues: {
            categories_id: [],
            is_active: true
        }
    });

    useEffect(() => {
        register({name: "categories_id"})
    }, [register]);

    useEffect(() => {
        categoryHttp
            .list()
            .then(response => setCategories(response.data.data))
    }, []);

    function onSubmit(formData, event) {
        genreHttp
            .create(formData)
            .then((response) => console.log(response));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"}
                margin={"normal"}
                inputRef={register}
            />
            <TextField
                select
                name="categories_id"
                value={watch('categories_id')}
                label="Categorias"
                margin={"normal"}
                variant={"outlined"}
                fullWidth
                onChange={(e) => {
                    // tive que setar como as any senao dava bug
                    setValue('categories_id', e.target.value as any);
                }}
                SelectProps={{multiple: true}}
            >
                <MenuItem value="" disabled={true}>
                    <em>Selecione categorias</em>
                </MenuItem>
                {
                    categories.map(
                        (category, key) => (
                            <MenuItem key={key} value={category.id}>
                                {category.name}
                            </MenuItem>
                        )
                    )
                }
            </TextField>
            <Checkbox
                name="is_active"
                inputRef={register}
            /> Ativo?
            <Box dir={"rtl"}>
                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
};