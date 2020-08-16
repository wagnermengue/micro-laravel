import * as React from 'react';
import {Box, Button, Checkbox, ButtonProps, makeStyles, TextField, Theme, FormControlLabel} from "@material-ui/core";
import {useForm} from "react-hook-form";
import categoryHttp from "../../util/http/category-http";
import * as yup from '../../util/vendor/yup';
import {useParams} from 'react-router';
import {useEffect, useState} from "react";
import {watch} from "fs";

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
});

const validationSchema = yup.object().shape({
    name: yup.string().required()
});

export const Form = () => {

    const classes = useStyles();

    const buttonProps: ButtonProps = {
        className: classes.submit,
        color: 'secondary',
        variant: "contained"
    }

    const {register, handleSubmit, getValues, setValue, errors, reset, watch} = useForm({
        // validationSchema,
        defaultValues: {
            is_active: true
        }
    });

    const {id} = useParams();
    const [category, setCategories] = useState<{id: string}>();

    useEffect(() => {
        register({name: "is_active"})
    }, [register]);

    useEffect(() => {
        if (!id) {
            return
        }
        categoryHttp
            .get(id)
            .then(({data}) => {
                setCategories(data.data)
                reset(data.data)
            });
    }, []);

    function onSubmit(formData, event) {
        const http = !category
            ? categoryHttp.create(formData)
            : categoryHttp.update(category.id, formData)
        http.then((response) => console.log(response));
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
                InputLabelProps={{shrink: true}}
                // error={errors.name !== undefined}
                // helperText={errors.name && errors.name.message}
            />
            <TextField
                name="description"
                label="Descrição"
                fullWidth
                multiline
                rows={4}
                variant={"outlined"}
                margin={"normal"}
                inputRef={register}
                InputLabelProps={{shrink: true}}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        name="is_active"
                        onChange={ () => setValue('is_active', !getValues()['is_active'])}
                        checked={watch('is_active')}
                    />
                }
                label={'Ativo?'}
                labelPlacement={'end'}
            />
            <Box dir={"rtl"}>
                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
};