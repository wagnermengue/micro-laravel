import * as React from 'react';
import {
    Checkbox,
    makeStyles,
    TextField,
    Theme,
    FormControlLabel,
    Grid, Typography, useTheme, useMediaQuery, Card, CardContent
} from "@material-ui/core";
import {useForm} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers';
import categoryHttp from "../../../util/http/category-http";
import * as yup from '../../../util/vendor/yup';
import {useParams, useHistory} from 'react-router';
import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import {Category, Video, VideoFileFieldMap} from "../../../util/models";
import SubmitActions from "../../../components/SubmitActions";
import {DefaultForm} from "../../../components/DefaultForm";
import videoHttp from "../../../util/http/video-http";
import RatingField from "./RatingField";
import UploadField from "./UploadField";
import AsyncAutocomplete from "../../../components/AsyncAutocomplete";
import genreHttp from "../../../util/http/genre-http";

const useStyles = makeStyles((theme:Theme) => ({
    cardUpload: {
        borderRadius: "4px",
        backgroundColor: "#f5f5f5",
        margin: theme.spacing(2,0)
    }
}));

const validationSchema = yup.object().shape({
    title: yup.string()
        .required()
        .label('Título')
        .max(255),
    description: yup.string()
        .required()
        .label('Sinopse'),
    year_launched: yup.number()
        .required()
        .min(1)
        .label('Ano de lançamento'),
    duration: yup.number()
        .required()
        .min(1)
        .label('Duração'),
    rating: yup.string()
        .required()
        .label('Classificação')
});

const fileFields = Object.keys(VideoFileFieldMap);

export const Form = () => {
    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        errors,
        reset,
        watch,
        //triggerValidation (ver o porque desse cara)
    } = useForm<any>({
        resolver: yupResolver(validationSchema)
    });

    const classes = useStyles();
    const snackbar = useSnackbar();
    const history = useHistory();
    const {id} = useParams();
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const theme = useTheme();
    const isGreaterMd = useMediaQuery(theme.breakpoints.up('md'));

    useEffect(() => {
        ['rating', 'opened', ...fileFields].forEach(name => register({name}));
        // acima a forma de fazer em uma linha o conteudo abaixo
        // const otherFields = ['rating', 'opened'];
        // for (let name of otherFields) {
        //     register({name});
        // }
    }, [register]);

    useEffect(() => {
        if (!id) {
            return
        }
        let isSubscribed = true;
        //iife
        (async () => {
            setLoading(true);
            try {
                const {data} = await videoHttp.get(id);
                if (isSubscribed){
                    setVideo(data.data);
                    reset(data.data);
                }

            } catch (error) {
                console.log(error);
                snackbar.enqueueSnackbar(
                'Não foi possível carregar as informações',
                    {variant: "error"})
            } finally {
                setLoading(false)
            }
        })();
        return () => {
            isSubscribed = false;
        }
    }, []);

    async function onSubmit(formData, event) {
        setLoading(true);
        try {
            const http = !video
                ? videoHttp.create(formData)
                : videoHttp.update(video.id, formData)
            const {data} = await http;
            snackbar.enqueueSnackbar(
                'Vídeo cadastrado com sucesso!',
                {variant: "success"});
            setTimeout(() => {
                event
                    ? (
                        id
                            ? history.replace(`/videos/${data.data.id}/edit`)
                            : history.push(`/videos/${data.data.id}/edit`)
                    ) :
                    history.push("/videos/")
            });
        } catch (error) {
            console.log(error);
            snackbar.enqueueSnackbar(
                'Falha ao cadastrar video',
                {variant: "error"})
        } finally {
            setLoading(false);
        }
    }

    const fetchOptions = (searchText) => genreHttp.list({
        queryParams: {
            search: searchText,
            all: ''
        }
    }).then(({data}) => data.data);

    return (
        <DefaultForm
            onSubmit={handleSubmit(onSubmit)}
            GridItemProps={{xs: 12}}
        >
            <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="title"
                        label="Título"
                        fullWidth
                        variant={"outlined"}
                        inputRef={register}
                        disabled={loading}
                        InputLabelProps={{shrink: true}}
                        error={errors.name !== undefined}
                        helperText={errors.name && errors.name.message}
                    />
                    <TextField
                        name="description"
                        label="Sinopse"
                        fullWidth
                        multiline
                        rows={4}
                        variant={"outlined"}
                        margin={"normal"}
                        inputRef={register}
                        disabled={loading}
                        InputLabelProps={{shrink: true}}
                        error={errors.description !== undefined}
                        helperText={errors.description && errors.description.message}
                    />
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <TextField
                                name="year_launched"
                                label="Ano de lançamento"
                                type="number"
                                margin="normal"
                                fullWidth
                                variant={"outlined"}
                                inputRef={register}
                                disabled={loading}
                                InputLabelProps={{shrink: true}}
                                error={errors.year_launched !== undefined}
                                helperText={errors.year_launched && errors.year_launched.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="duration"
                                label="Duração"
                                type="number"
                                margin="normal"
                                fullWidth
                                variant={"outlined"}
                                inputRef={register}
                                disabled={loading}
                                InputLabelProps={{shrink: true}}
                                error={errors.duration !== undefined}
                                helperText={errors.duration && errors.duration.message}
                            />
                        </Grid>
                    </Grid>
                    Elenco
                    <br/>
                    <AsyncAutocomplete
                        fetchOptions={fetchOptions}
                        AutocompleteProps={{
                            freeSolo: true,
                            getOptionLabel: option => option.name
                        }}
                        TextFieldProps={{
                            label: 'Gêneros'
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <RatingField
                        value={watch('rating')}
                        setValue={(value) => setValue('rating', value)}
                        error={errors.rating}
                        disabled={loading}
                        FormControlProps={{
                            margin: isGreaterMd ? 'none' : 'normal'
                        }}
                    />
                    <br/>
                    <Card className={classes.cardUpload}>
                        <CardContent>
                            <Typography color={"primary"} variant={"h6"}>
                                Imagens
                            </Typography>
                            <UploadField
                                accept={"image/*"}
                                label={"Thumb"}
                                setValue={(value) => setValue("thumb_file", value)}
                            />
                            <UploadField
                                accept={"image/*"}
                                label={"Banner"}
                                setValue={(value) => setValue("banner_file", value)}
                            />
                        </CardContent>
                    </Card>
                    <Card className={classes.cardUpload}>
                        <CardContent>
                            <Typography color={"primary"} variant={"h6"}>
                                Vídeos
                            </Typography>
                            <UploadField
                                accept={"video/mp4"}
                                label={"Trailer"}
                                setValue={(value) => setValue("trailer_file", value)}
                            />
                            <UploadField
                                accept={"video/mp4"}
                                label={"Principal"}
                                setValue={(value) => setValue("video_file", value)}
                            />
                        </CardContent>
                    </Card>
                    <br/>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="opened"
                                color={'primary'}
                                onChange={() => setValue('opened', !getValues()['opened'])}
                                checked={watch('opened')}
                                disabled={loading}
                            />
                        }
                        label={
                            <Typography color={'primary'} variant={'subtitle2'}>
                                Quero que este conteúdo apareça na seção lançamentos
                            </Typography>
                        }
                    />
                </Grid>
            </Grid>
            <SubmitActions
                disabledButtons={loading}
                handleSave={() =>
                    onSubmit(getValues(), null)
                    //ver o porque desse cara
                    // triggerValidation().then(isValid => {
                    //     isValid && onSubmit(getValues(), null)
                    // })
                }
            />
        </DefaultForm>
    );
};