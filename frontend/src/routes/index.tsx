import {RouteProps} from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import List from "../pages/category/List";

interface MYRouteProps extends RouteProps
{
    label: string
}

const routes = [
    {
        label: "Dashboard",
        path: "/",
        component: Dashboard,
        exact: true
    },
    {
        label: "Listar categorias",
        path: "/categorias",
        component: List,
        exact: true
    }
];

export default routes;