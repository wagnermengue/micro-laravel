import * as React from 'react';
import {Box, Button, ButtonProps, makeStyles, TextField, Theme} from "@material-ui/core";
import {CheckBox} from "@material-ui/icons";

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

    return (
        <form>
            <TextField
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"}
                margin={"normal"}
            />
            <TextField
                name="description"
                label="Descrição"
                fullWidth
                multiline
                rows={4}
                variant={"outlined"}
                margin={"normal"}
            />
            <CheckBox
                name="is_active"
            /> Ativo?
            <Box dir={"rtl"}>
                <Button {...buttonProps}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
};