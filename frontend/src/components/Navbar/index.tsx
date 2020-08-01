import * as React from 'react';
import {AppBar, Button, Theme, Toolbar, Typography} from "@material-ui/core";
import logo from "../../static/img/logo.png";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
    toolbar: {
        backgroundColor: "#000000"
    },
    title: {
        flexGrow: 1,
        textAlign: "center"
    },
    logo: {
        width: 100,
        [theme.breakpoints.up('sm')] : {
            width: 170
        }
    }
}));

export const Navbar: React.FC = () => {
    const classes = useStyles();
    return (
        <AppBar>
            <Toolbar className={classes.toolbar}>
                <Typography className={classes.title}>
                    <img src={logo} alt="Codeflix" className={classes.logo}/>
                </Typography>
                <Button color="inherit">
                    Login
                </Button>
            </Toolbar>
        </AppBar>
    );
};