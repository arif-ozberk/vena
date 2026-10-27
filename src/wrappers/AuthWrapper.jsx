import React, { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';

// Styles
import "../sass/globals.scss";

// Components
import Sidebar from '../components/shared_components/Sidebar';
import MobileNavbar from '../components/shared_components/MobileNavbar';

// Context
import { AuthContext } from '../context/AuthContext';
import { UIContext } from '../context/UIContext';

// Vena-DB
import authDB from '../config/authDB';

// Functions
import { setTabName } from '../functions/SetTabName';


const AuthWrapper = ({ children }) => {

    const {
        isAuthenticated,
        setIsAuthenticated,
        setUserSession,
        isSessionLoading,
        setIsSessionLoading,
        setLoggedUserData,
        currentPage
    } = useContext(AuthContext);

    const { setCurrentPage } = useContext(UIContext);


    useEffect(() => {
        authDB.getSession(setIsAuthenticated, setUserSession, setIsSessionLoading, setLoggedUserData);

        window.scrollTo(0, 0);
    }, [])
    
    
    useEffect(() => {
        setTabName(setCurrentPage);
    }, []);


    if (isSessionLoading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height:"100vh" }}>
            <h1>Loading...</h1>
            <Sidebar />
            <MobileNavbar />
        </div>
    );

    else {
        if (!isAuthenticated) return (
            <Navigate to="/" />
        )

        if (isAuthenticated) return (
            <div className={`page-container`}>
                {/* <PageLoader /> */}
                {children}
                <Sidebar />
                <MobileNavbar />
            </div>
        )
    }
}

export default AuthWrapper;