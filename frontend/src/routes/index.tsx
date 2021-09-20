import {RouteProps} from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import CategoryList from "../pages/category/PageList";
import CastMembersList from "../pages/cast-member/PageList";
import GenreList from "../pages/genre/PageList";
import CategoryForm from "../pages/category/PageForm";
import CastMembersForm from "../pages/cast-member/PageForm";
import GenreForm from "../pages/genre/PageForm";
import VideoList from "../pages/video/PageList";
import VideoForm from "../pages/video/PageForm";
import UploadPage from "../pages/uploads"

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
        component: CategoryForm,
        exact: true
    },
    {
        name: 'categories.edit',
        label: "Editar categorias",
        path: "/categories/:id/edit",
        component: CategoryForm,
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
        component: CastMembersForm,
        exact: true
    },
    {
        name: 'cast_members.edit',
        label: "Editar membros de elencos",
        path: "/cast-members/:id/edit",
        component: CastMembersForm,
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
        component: GenreForm,
        exact: true
    },
    {
        name: 'genre.edit',
        label: "Editar gênero",
        path: "/genres/:id/edit",
        component: GenreForm,
        exact: true
    },
    {
        name: 'video.list',
        label: "Listar vídeos",
        path: "/videos",
        component: VideoList,
        exact: true
    },
    {
        name: 'video.create',
        label: "Criar Vídeo",
        path: "/videos/create",
        component: VideoForm,
        exact: true
    },
    {
        name: 'video.edit',
        label: "Editar vídeo",
        path: "/videos/:id/edit",
        component: VideoForm,
        exact: true
    },
    {
        name: 'uploads',
        label: "Uploads",
        path: "/uploads/",
        component: UploadPage,
        exact: true
    },
];

export default routes;