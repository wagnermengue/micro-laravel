import * as React from 'react';
import {AppBar, Button, Toolbar, Typography} from "@material-ui/core";
import logo from "../../static/img/logo.png";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    toolbar: {
        backgroundColor: "#000000"
    },
    title: {
        flexGrow: 1,
        textAlign: "center"
    }
});

export const Navbar: React.FC = () => {
    const classes = useStyles();
    return (
        <AppBar>
            <Toolbar className={classes.toolbar}>
                <Typography className={classes.title}>
                    <img src={logo} alt="Codeflix"/>
                </Typography>
                <Button color="inherit">
                    Login
                </Button>
            </Toolbar>
        </AppBar>
    );
};