import * as React from 'react';
import {AppBar, Button, IconButton, Menu, MenuItem, Theme, Toolbar, Typography} from "@material-ui/core";
import logo from "../../static/img/logo.png";
import {makeStyles} from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";

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
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                >
                    <MenuIcon/>
                </IconButton>
                <Menu
                    id="menu-appbar"
                    open={false}
                >
                    <MenuItem>
                        Categorias
                    </MenuItem>
                </Menu>
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