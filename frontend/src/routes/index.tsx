import {RouteProps} from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import CategoryList from "../pages/category/PageList";
import CastMembersList from "../pages/cast-member/PageList";
import GenreList from "../pages/genre/PageList";

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
        path: "/categories",
        component: CategoryList,
        exact: true
    },
    {
        name: 'categories.create',
        label: "Criar categorias",
        path: "/categories/create",
        component: CategoryList,
        exact: true
    },
    {
        name: 'cast_members.list',
        label: "Listar membros de elencos",
        path: "/cast-members",
        component: CastMembersList,
        exact: true
    },
    {
        name: 'cast_members.create',
        label: "Criar membros de elencos",
        path: "/cast-members/create",
        component: CastMembersList,
        exact: true
    },
    {
        name: 'genre.list',
        label: "Listar gêneros",
        path: "/genres",
        component: GenreList,
        exact: true
    },
    {
        name: 'genre.create',
        label: "Criar gênero",
        path: "/genres/create",
        component: GenreList,
        exact: true
    }
];

export default routes;