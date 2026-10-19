import React, { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';

// Styles
import "../sass/globals.scss";

// Components

// Context
import { AuthContext } from '../context/AuthContext';

// Vena-DB
import authDB from '../config/authDB';


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


    useEffect(() => {
        authDB.getSession(setIsAuthenticated, setUserSession, setIsSessionLoading, setLoggedUserData);

        window.scrollTo(0, 0);
    }, [])


    if (isSessionLoading) return (
        <>

        </>
    );

    else {
        if (!isAuthenticated) return (
            <Navigate to="/" />
        )

        if (isAuthenticated) return (
            <div>
                {/* <PageLoader /> */}
                {children}
            </div>
        )
    }
}

export default AuthWrapper;