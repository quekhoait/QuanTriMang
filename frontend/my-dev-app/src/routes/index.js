import React from "react";
import HomePage from '../pages/HomePage/HomePage'
import SigInPage from "../pages/SigInPage/SigInPage";
import SigUpPage from "../pages/SigUpPage/SigUpPage";

export const routes = [
    {
        path: "/",
        page: HomePage
    },
    {
        path: "/login",
        page: SigInPage
    },
    {
        path: "/regis",
        page: SigUpPage
    }
]

export default routes