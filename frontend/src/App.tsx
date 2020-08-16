import React from 'react';
import './App.css';
import {Navbar} from "./components/Navbar";
import {Box, CssBaseline, MuiThemeProvider} from "@material-ui/core";
import AppRouter from "./routes/AppRouter";
import {BrowserRouter} from "react-router-dom";
import Breadcrumbs from "./components/Breadcrumbs";
import theme from "./theme";
import {SnackbarProvider} from "./components/SnackbarProvider";

function App() {
    return (
        <React.Fragment>
            <MuiThemeProvider theme={theme}>
                <SnackbarProvider>
                    <CssBaseline/>
                    <BrowserRouter>
                        <Navbar/>
                        <Box paddingTop={"70px"}>
                            <Breadcrumbs/>
                            <AppRouter/>
                        </Box>
                    </BrowserRouter>
                </SnackbarProvider>
            </MuiThemeProvider>
        </React.Fragment>
    );
}

export default App;
