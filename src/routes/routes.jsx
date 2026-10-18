import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, Navigate, Outlet } from "react-router-dom";


// Pages
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";
import SignInPage from "../pages/auth/SignInPage";
import SignUpPage from "../pages/auth/SignUpPage";

// React-Toastify
import { ToastContainer } from "react-toastify";


const routes = [
    {
        routePath: "/login",
        routeElement: <SignInPage />
    },
    {
        routePath: "/signup",
        routeElement: <SignUpPage />
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