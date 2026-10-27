import React, { useContext } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, Navigate, Outlet } from "react-router-dom";


// Pages
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";
import SignInPage from "../pages/auth/SignInPage";
import SignUpPage from "../pages/auth/SignUpPage";
import Dashboard from "../pages/Dashboard";
import UserSettingsPage from "../pages/UserSettingsPage";
import ProjectReportPage from "../pages/app/ProjectReportPage";
import CalendarAppPage from "../pages/app/CalendarAppPage";
import ProjectComponentsPage from "../pages/app/ProjectComponentsPage";
import AboutVenaPage from "../pages/app/AboutVenaPage";

// React-Toastify
import { ToastContainer } from "react-toastify";

// Context
import { AuthContext } from "../context/AuthContext";


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
        routePath: "/dashboard/user-settings",
        routeElement: <UserSettingsPage />
    },
    {
        routePath: "/dashboard/project-report",
        routeElement: <ProjectReportPage />
    },
    {
        routePath: "/dashboard/calendar-app",
        routeElement: <CalendarAppPage />
    },
    {
        routePath: "/dashboard/project-components",
        routeElement: <ProjectComponentsPage />
    },
    {
        routePath: "/dashboard/about-vena",
        routeElement: <AboutVenaPage/>
    }
];


const RootLayout = () => {

    const { loggedUserData } = useContext(AuthContext);

    const isNotificationEnabled = loggedUserData
        ? (loggedUserData?.user_settings?.visual_settings?.notificationSetting ?? true)
        : true;

    return (
        <>
            {isNotificationEnabled && <ToastContainer />}
            <Outlet />
        </>
    )
};


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