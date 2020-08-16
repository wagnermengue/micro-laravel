import React from 'react';
import './App.css';
import {Navbar} from "./components/Navbar";
import {Box, CssBaseline, MuiThemeProvider} from "@material-ui/core";
import AppRouter from "./routes/AppRouter";
import {BrowserRouter} from "react-router-dom";
import Breadcrumbs from "./components/Breadcrumbs";
import theme from "./theme";

function App() {
    return (
        <React.Fragment>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <Navbar/>
                    <Box paddingTop={"70px"}>
                        <Breadcrumbs/>
                        <AppRouter/>
                    </Box>
                </BrowserRouter>
            </MuiThemeProvider>
        </React.Fragment>
    );
}

export default App;
