import React from "react";
import HomePage from '../pages/HomePage/HomePage'
import SigInPage from "../pages/SigInPage/SigInPage";
import SigUpPage from "../pages/SigUpPage/SigUpPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";

export const routes = [
    {
        path: "/",
        page: HomePage
    },
    {
        path: "/account/login",
        page: SigInPage
    },
    {
        path: "/account/regis",
        page: SigUpPage
    },{
        path: "/profile",
        page: ProfilePage
    }
]

export default routes