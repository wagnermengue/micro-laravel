import * as React from 'react';
import {
    Checkbox,
    makeStyles,
    TextField,
    Theme,
    FormControlLabel,
    Grid, Typography, useTheme, useMediaQuery, Card, CardContent, FormHelperText
} from "@material-ui/core";
import {useForm} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers';
import categoryHttp from "../../../util/http/category-http";
import * as yup from '../../../util/vendor/yup';
import {useParams, useHistory} from 'react-router';
import {createRef, MutableRefObject, useEffect, useRef, useState} from "react";
import {useSnackbar} from "notistack";
import {Category, Genre, Video, VideoFileFieldMap} from "../../../util/models";
import SubmitActions from "../../../components/SubmitActions";
import {DefaultForm} from "../../../components/DefaultForm";
import videoHttp from "../../../util/http/video-http";
import RatingField from "./RatingField";
import UploadField from "./UploadField";
import AsyncAutocomplete from "../../../components/AsyncAutocomplete";
import genreHttp from "../../../util/http/genre-http";
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";
import useHttpHandle from "../../../hooks/useHttpHandle";
import GenreField, {GenreFieldComponent} from "./GenreField";
import CategoryField, {CategoryFieldComponent} from "./CategoryField";
import CastMemberField, {CastMemberFieldComponent} from "./CastMemberField";
import {InputFileComponent} from "../../../components/InputFile";
import {omit, zipObject} from "lodash";

const useStyles = makeStyles((theme:Theme) => ({
    cardUpload: {
        borderRadius: "4px",
        backgroundColor: "#f5f5f5",
        margin: theme.spacing(2,0)
    },
    cardOpened: {
        borderRadius: "4px",
        backgroundColor: "#f5f5f5",
    },
    cardContentOpened: {
        paddingBottom: theme.spacing(2) + 'px !important'
    },
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
    genres: yup.array()
        .label('Gêneros')
        .required()
        //erro: value Object is of type 'unknown'.
        .test({
            message: 'Cada gênero escolhido precisa ter pelo menos uma categoria selecionada',
            test(value){ //array genres [{name, categories: []}]
                const genres = value as Genre[];
                return genres.every(
                    v => v.categories.filter(
                        cat => this.parent.categories.map(c => c.id).includes(cat.id)
                    ).length !== 0
                );
            }
        }),
    categories: yup.array()
        .label('Categorias')
        .required(),
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
        trigger // ver porque esse cara causa problema
    } = useForm<any>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            genres: [],
            categories: [],
            cast_members: [],
            rating: null,
            opened: false,
        }
    });

    const classes = useStyles();
    const snackbar = useSnackbar();
    const history = useHistory();
    const {id} = useParams();
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const theme = useTheme();
    const isGreaterMd = useMediaQuery(theme.breakpoints.up('md'));

    const castMemberRef = useRef() as MutableRefObject<CastMemberFieldComponent>;
    const genreRef = useRef() as MutableRefObject<GenreFieldComponent>;
    const categoryRef = useRef() as MutableRefObject<CategoryFieldComponent>;
    const uploadsRef = useRef(
        zipObject(fileFields, fileFields.map(() => createRef()))
    ) as MutableRefObject<{ [key: string]: MutableRefObject<InputFileComponent> }>;

    useEffect(() => {
        ['rating', 'opened', 'genres', 'categories', 'cast_members', ...fileFields].forEach(name => register({name}));
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
        const sendData = omit(formData, ['cast_members', 'genres', 'categories']);
        console.log(sendData);
        sendData['cast_members_id'] = formData['cast_members'].map(cast_member => cast_member.id);
        sendData['categories_id'] = formData['categories'].map(category => category.id);
        sendData['genres_id'] = formData['genres'].map(genre => genre.id);

        setLoading(true);
        try {
            const http = !video
                ? videoHttp.create(sendData)
                : videoHttp.update(video.id, {...sendData, _method: 'PUT'}, {http: {usePost: true}})
            const {data} = await http;
            snackbar.enqueueSnackbar(
                'Vídeo cadastrado com sucesso!',
                {variant: "success"});
            //id && resetForm(video);
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

    function resetForm(data) {
        Object.keys(uploadsRef.current).forEach(
            field => uploadsRef.current[field].current.clear()
        );
        castMemberRef.current.clear();
        genreRef.current.clear();
        categoryRef.current.clear();
        reset(data); //removido se quiser
    }

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
                    <CastMemberField
                        ref={castMemberRef}
                        castMembers={watch('cast_members')}
                        setCastMembers={(value) => setValue('cast_members', value)}
                        error={errors.cast_members}
                        disabled={loading}
                    />
                    <br/>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <GenreField
                                ref={genreRef}
                                genres={watch('genres')}
                                setGenres={(value) => setValue('genres', value)}
                                categories={watch('categories')}
                                setCategories={(value) => setValue('categories', value)}
                                error={errors.genres}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CategoryField
                                ref={categoryRef}
                                categories={watch('categories')}
                                setCategories={(value) => setValue('categories', value)}
                                genres={watch('genres')}
                                error={errors.categories}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormHelperText>
                                Escolha os gêneros dos vídeos
                            </FormHelperText>
                            <FormHelperText>
                                Escola pelo menos uma categoria de cada gênero
                            </FormHelperText>
                        </Grid>
                    </Grid>
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
                    <Card className={classes.cardOpened}>
                        <CardContent className={classes.cardContentOpened}>
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
                                labelPlacement={"end"}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <SubmitActions
                disabledButtons={loading}
                handleSave={() =>
                    // onSubmit(getValues(), null),
                    // ver porque esse cara da problema
                    trigger().then(isValid => {
                        isValid && onSubmit(getValues(), null)
                    })
                }
            />
        </DefaultForm>
    );
};