import * as React from 'react';
import {Box, Button, Checkbox, ButtonProps, makeStyles, TextField, Theme, FormControlLabel} from "@material-ui/core";
import {useForm} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers';
import categoryHttp from "../../util/http/category-http";
import * as yup from '../../util/vendor/yup';
import {useParams, useHistory} from 'react-router';
import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import {Category} from "../../util/models";
import SubmitActions from "../../components/SubmitActions";
import {DefaultForm} from "../../components/DefaultForm";

const validationSchema = yup.object().shape({
    name: yup.string().required()
});

export const Form = () => {
    const {register, handleSubmit, getValues, setValue, errors, reset, watch} = useForm<any>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            is_active: true
        }
    });

    const snackbar = useSnackbar();
    const history = useHistory();
    const {id} = useParams();
    const [category, setCategories] = useState<Category>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        register({name: "is_active"})
    }, [register]);

    useEffect(() => {
        if (!id) {
            return
        }

        //iife
        (async function getCategory() {
            setLoading(true);
            try {
                const {data} = await categoryHttp.get(id);
                setCategories(data.data);
                reset(data.data);
            } catch (error) {
                console.log(error);
                snackbar.enqueueSnackbar(
                    'Não foi possível carregar a lista de categorias',
                    {variant: "error"})
            } finally {
                setLoading(false)
            }
        })();
    }, []);

    async function onSubmit(formData, event) {
        setLoading(true);
        try {
            const http = !category
                ? categoryHttp.create(formData)
                : categoryHttp.update(category.id, formData)
            const {data} = await http;
            snackbar.enqueueSnackbar(
                'Categoria cadastrada com sucesso!',
                {variant: "success"});
            setTimeout(() => {
                event
                    ? (
                        id
                            ? history.replace(`/categories/${data.data.id}/edit`)
                            : history.push(`/categories/${data.data.id}/edit`)
                    ) :
                    history.push("/categories/")
            });
        } catch (error) {
            console.log(error);
            snackbar.enqueueSnackbar(
                'Falha ao cadastrar categoria',
                {variant: "error"})
        } finally {
            setLoading(false);
        }
    }

    return (
        <DefaultForm onSubmit={handleSubmit(onSubmit)}>
            <TextField
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"}
                margin={"normal"}
                inputRef={register}
                disabled={loading}
                InputLabelProps={{shrink: true}}
                error={errors.name !== undefined}
                helperText={errors.name && errors.name.message}
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
                disabled={loading}
                InputLabelProps={{shrink: true}}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        name="is_active"
                        onChange={() => setValue('is_active', !getValues()['is_active'])}
                        checked={watch('is_active')}
                    />
                }
                label={'Ativo?'}
                labelPlacement={'end'}
                disabled={loading}
            />
            <SubmitActions
                disabledButtons={loading}
                handleSave={() => onSubmit(getValues(), null)}
            />
        </DefaultForm>
    );
};