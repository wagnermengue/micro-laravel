import * as React from 'react';
import {Page} from "../../components/Page";
import {Form} from "./Form";

const PageForm = () => {
    return (
        <div>
            <Page title="Criar gênero">
                <Form/>
            </Page>
        </div>
    );
};

export default PageForm;