import React from 'react';
import './App.css';
import {Navbar} from "./components/Navbar";
import {Box} from "@material-ui/core";
import AppRouter from "./routes/AppRouter";
import {BrowserRouter} from "react-router-dom";
import Breadcrumbs from "./components/Breadcrumbs";

function App() {
    return (
        <React.Fragment>
            <BrowserRouter>
                <Navbar/>
                <Box paddingTop={"70px"}>
                    <Breadcrumbs/>
                    <AppRouter/>
                </Box>
            </BrowserRouter>
        </React.Fragment>
    );
}

export default App;
