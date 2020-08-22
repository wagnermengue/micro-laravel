import * as React from 'react';
import {
    Box,
    Button,
    ButtonProps,
    makeStyles,
    TextField,
    Theme,
    FormControl,
    FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText
} from "@material-ui/core";
import {useForm} from "react-hook-form";
import castMemberHttp from "../../util/http/castMember-http";
import {useEffect, useState} from "react";
import * as yup from "../../util/vendor/yup";
import {yupResolver} from "@hookform/resolvers";
import {useSnackbar} from "notistack";
import {useHistory, useParams} from "react-router";

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
});

const validationSchema = yup.object().shape({
    name: yup.string()
        .label("Nome")
        .required()
        .max(255),
    type: yup.number()
        .label("Tipo")
        .required()
});

export const Form = () => {

    const {register, handleSubmit, getValues, setValue, errors, reset, watch,} = useForm<any>({
        resolver: yupResolver(validationSchema),
    });

    const classes = useStyles();
    const snackbar = useSnackbar();
    const history = useHistory();
    const {id} = useParams();
    const [castMember, setCastMember] = useState<{ id: string | null}>();
    const [loading, setLoading] = useState<boolean>(false);

    const buttonProps : ButtonProps = {
        className: classes.submit,
        color: 'secondary',
        variant: "contained",
        disabled: loading
    }

    useEffect(() => {
        register({name: "type"})
    }, [register]);

    useEffect(() => {
        if (!id) {
            return
        }

        (async function getCastMember() {
            setLoading(true);
            try {
                const {data} = await castMemberHttp.get(id);
                setCastMember(data.data);
                reset(data.data);
            } catch (error) {
                console.log(error);
                snackbar.enqueueSnackbar(
                    'Não foi possível carregar o elenco',
                    {variant: "error"})
            } finally {
                setLoading(false)
            }
        })();
    }, []);

    async function onSubmit(formData, event) {
        setLoading(true);
        try {
            const http = !castMember
                ? castMemberHttp.create(formData)
                : castMemberHttp.update(castMember.id, formData);
            const {data} = await http;
            snackbar.enqueueSnackbar(
                'Membro de elenco cadastrado com sucesso!',
                {variant: "success"});
            setTimeout(() => {
                event
                    ? (
                        id
                            ? history.replace(`/cast-members/${data.data.id}/edit`)
                            : history.push(`/cast-members/${data.data.id}/edit`)
                    ) :
                    history.push("/cast-members/")
            });
        } catch (error) {
            console.log(error);
            snackbar.enqueueSnackbar(
                'Falha ao cadastrar elenco',
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
                error={errors.name !== undefined}
                helperText={errors.name && errors.name.settings}
            />
            <FormControl
                margin="normal"
                error={errors.type !== undefined}
                disabled={loading}
            >
                <FormLabel component="legend">Tipo</FormLabel>
                <RadioGroup
                    name="type"
                    onChange={(e) => {
                        setValue("type", parseInt(e.target.value));
                    }}
                    value={watch('type') + ""}
                >
                    <FormControlLabel value="1" control={<Radio/>} label="Diretor"/>
                    <FormControlLabel value="2" control={<Radio/>} label="Ator"/>
                </RadioGroup>
                {
                    errors.type
                        ? <FormHelperText id="type-helper-text">{errors.type.message}</FormHelperText>
                        : null
                }
            </FormControl>
            <Box dir={"rtl"}>
                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
};