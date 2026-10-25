import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, Navigate, Outlet } from "react-router-dom";


// Pages
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";
import SignInPage from "../pages/auth/SignInPage";
import SignUpPage from "../pages/auth/SignUpPage";
import Dashboard from "../pages/Dashboard";
import Heart from "../pages/app/Heart";
import Google from "../pages/app/Google";
import Facebook from "../pages/app/Facebook";
import Github from "../pages/app/Github";

// React-Toastify
import { ToastContainer } from "react-toastify";


const routes = [
    {
        routePath: "/signin",
        routeElement: <SignInPage />
    },
    {
        routePath: "/signup",
        routeElement: <SignUpPage />
    },
    {
        routePath: "/dashboard",
        routeElement: <Dashboard />
    },
    {
        routePath: "/dashboard/heart",
        routeElement: <Heart />
    },
    {
        routePath: "/dashboard/google",
        routeElement: <Google />
    },
    {
        routePath: "/dashboard/facebook",
        routeElement: <Facebook />
    },
    {
        routePath: "/dashboard/github",
        routeElement: <Github />
    }
];


const RootLayout = () => (
    <>
        <ToastContainer />
        <Outlet />
    </>
);


export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />

            {routes.map((routeItem) => (
                <Route key={routeItem.routePath} path={routeItem.routePath} element={routeItem.routeElement} />
            ))}

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
    )
);