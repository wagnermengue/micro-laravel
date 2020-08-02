import {RouteProps} from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import List from "../pages/category/List";

export interface MYRouteProps extends RouteProps
{
    name: string,
    label: string
}

const routes = [
    {
        name: 'dashboard',
        label: "Dashboard",
        path: "/",
        component: Dashboard,
        exact: true
    },
    {
        name: 'categories.list',
        label: "Listar categorias",
        path: "/categorias",
        component: List,
        exact: true
    }
];

export default routes;