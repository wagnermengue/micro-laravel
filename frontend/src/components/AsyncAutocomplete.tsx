import * as React from 'react';
import {CircularProgress, TextField, TextFieldProps} from "@material-ui/core";
import {Autocomplete, AutocompleteProps} from "@material-ui/lab";
import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";

interface AsyncAutocompleteProps {
    fetchOptions: (searchText) => Promise<any>;
    TextFieldProps?: TextFieldProps
    AutocompleteProps?: Omit<AutocompleteProps<any>, 'renderInput'>
}

const AsyncAutocomplete: React.FC<AsyncAutocompleteProps> = (props) => {

    const {AutocompleteProps} = props;
    const {freeSolo, onOpen, onClose, onInputChange} = AutocompleteProps as any;
    const [open, setOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);

    const snackbar = useSnackbar();

    const textFieldProps: TextFieldProps = {
        margin: 'normal',
        variant: 'outlined',
        fullWidth: true,
        InputLabelProps: {shrink: true},
        ...(props.TextFieldProps && {...props.TextFieldProps})
    };

    const autoCompleteProps: AutocompleteProps<any> = {
        loading: loading,
        loadingText: 'Carregando...',
        ...(AutocompleteProps && {...AutocompleteProps}),
        open,
        options,
        noOptionsText: 'Nenhum item encontrado',
        onOpen() {
            setOpen(true);
            onOpen && onOpen();
        },
        onClose() {
            setOpen(false);
            onClose && onClose();
        },
        onInputChange(event, value) {
            setSearchText(value);
            onInputChange && onInputChange();
        },
        renderInput: params => {
            return <TextField
                {...params}
                {...textFieldProps}
                InputProps={
                    {
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading && <CircularProgress color={'inherit'} size={20} />}
                                {params.InputProps.endAdornment}
                            </>
                        )
                    }
                }
            />
        }
    };

    useEffect(() => {
        if (!open && !freeSolo) {
            setOptions([]);
        }
    }, [open]);

    useEffect(() => {
        if (!open || searchText ==  "" && freeSolo) {
            return;
        }

        let isSubscribed = true;
        (async () => {
            setLoading(true);
            try {
                const data = await props.fetchOptions(searchText);
                if (isSubscribed) {
                    setOptions(data);
                }
            } catch (error) {
                console.error(error);
                snackbar.enqueueSnackbar(
                    'Não foi possível carregar as informações',
                    {variant: 'error'}
                )
            } finally {
                setLoading(false);
            }
        })();
        return () => {
            isSubscribed = false
        }
    }, [freeSolo ? searchText : open]);

    return (
        <div>
            <Autocomplete {...autoCompleteProps}/>
        </div>
    );
};

export default AsyncAutocomplete;