import * as React from 'react';
import {Checkbox, TextField, MenuItem} from "@material-ui/core";
import {useForm} from "react-hook-form";
import genreHttp from "../../util/http/genre-http";
import categoryHttp from "../../util/http/category-http";
import {useEffect, useState} from "react";
import * as yup from "../../util/vendor/yup";
import {yupResolver} from "@hookform/resolvers";
import {useSnackbar} from "notistack";
import {useHistory, useParams} from "react-router";
import {Category, Genre} from "../../util/models";
import SubmitActions from "../../components/SubmitActions";

const validationSchema = yup.object().shape({
    name: yup.string()
        .label("Nome")
        .required()
        .max(255),
    categories_id: yup.number()
        .label("Categorias")
        .required()
});

export const Form = () => {

    const {register, handleSubmit, getValues, setValue, watch, errors, reset} = useForm<any>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            categories_id: [],
            is_active: true
        }
    });

    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const {id} = useParams();
    const [genre, setGenre] = useState<Genre>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        register({name: "categories_id"})
    }, [register]);

    useEffect(() => {
        let isSubscribe = true;
        (async () => {
            setLoading(true);
            const promises = [categoryHttp.list({ queryParams: {all: ''}})];
            if (id) {
                promises.push(genreHttp.get(id));
            }
            try {
                const [categoriesResponse, genreResponse] = await Promise.all(promises);
                if (isSubscribe) {
                    setCategories(categoriesResponse.data.data);
                    if (id) {
                        setGenre(genreResponse.data.data);
                        const categories_id = genreResponse.data.data.categories.map(category => category.id)
                        reset({
                            ...genreResponse.data.data,
                            categories_id
                        });
                    }
                }
            } catch (error) {
                console.log(error);
                enqueueSnackbar(
                    'Não foi possível carregar as informações',
                    {variant: "error"})
            } finally {
                setLoading(false)
            }
        })();

        return () => {
            isSubscribe = false;
        }
    }, [id, reset, enqueueSnackbar]);

    async function onSubmit(formData, event) {
        setLoading(true);
        try {
            const http = !genre
                ? genreHttp.create(formData)
                : genreHttp.update(genre.id, formData)
            const {data} = await http;
            enqueueSnackbar(
                'Gênero cadastrado com sucesso!',
                {variant: "success"});
            setTimeout(() => {
                event
                    ? (
                        id
                            ? history.replace(`/genres/${data.data.id}/edit`)
                            : history.push(`/genres/${data.data.id}/edit`)
                    ) :
                    history.push("/genres/")
            });
        } catch (error) {
            console.log(error);
            enqueueSnackbar(
                'Falha ao cadastrar gênero',
                {variant: "error"})
        } finally {
            setLoading(false);
        }
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
                disabled={loading}
                InputLabelProps={{shrink: true}}
                error={errors.name !== undefined}
                helperText={errors.name && errors.name.message}
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
                disabled={loading}
                InputLabelProps={{shrink: true}}
                error={errors.categories_id !== undefined}
                helperText={errors.categories_id && errors.categories_id.message}
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
                defaultChecked
            /> Ativo?
            <SubmitActions
                disabledButtons={loading}
                handleSave={() => onSubmit(getValues(), null)}
            />
        </form>
    );
};