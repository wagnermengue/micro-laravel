import React from 'react';
import './App.css';
import {Navbar} from "./components/Navbar";
import {Box, CssBaseline, MuiThemeProvider} from "@material-ui/core";
import AppRouter from "./routes/AppRouter";
import {BrowserRouter} from "react-router-dom";
import Breadcrumbs from "./components/Breadcrumbs";
import theme from "./theme";
import {SnackbarProvider} from "./components/SnackbarProvider";
import Spinner from "./components/Spinner";
import LoadingProvider from "./components/loading/LoadingProvider";

function App() {
    return (
        <React.Fragment>
            <LoadingProvider>
                <MuiThemeProvider theme={theme}>
                    <SnackbarProvider>
                        <CssBaseline/>
                        <BrowserRouter>
                            <Spinner/>
                            <Navbar/>
                            <Box paddingTop={"70px"}>
                                <Breadcrumbs/>
                                <AppRouter/>
                            </Box>
                        </BrowserRouter>
                    </SnackbarProvider>
                </MuiThemeProvider>
            </LoadingProvider>
        </React.Fragment>
    );
}

export default App;
