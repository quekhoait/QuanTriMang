import React from "react";
import HomePage from '../pages/HomePage/HomePage'
import SigInPage from "../pages/SigInPage/SigInPage";
import SigUpPage from "../pages/SigUpPage/SigUpPage";

export const routes = [
    {
        path: "/homePage",
        page: HomePage
    },
    {
        path: "/account/login",
        page: SigInPage
    },
    {
        path: "/account/regis",
        page: SigUpPage
    }
]

export default routes