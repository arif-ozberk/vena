import React, { useContext } from 'react';

// Styles
import styles from "../sass/dashboardPage_styles/Dashboard.module.scss";

// React-Router
import { useNavigate } from 'react-router-dom';

// Wrappers
import AuthWrapper from '../wrappers/AuthWrapper';

// Context
import { AuthContext } from '../context/AuthContext';

// Vena-DB
import authDB from '../config/authDB';

// React-Toastify
import { toast } from 'react-toastify';
import toastifyOptions from '../mocks/toastifyOptions';


const Dashboard = () => {

    const navigate = useNavigate();

    const {
        loggedUserData, setLoggedUserData,
        setUserSession,
        setIsAuthenticated,
        setIsSessionLoading
    } = useContext(AuthContext);


    const handleSignOutButton = () => {
        authDB.handleSignOut(setUserSession, setIsAuthenticated, setIsSessionLoading, setLoggedUserData);
        toast.success("Signed out successfully", toastifyOptions.darkTopRight);
        navigate("/");
    }


    return (
        <AuthWrapper>
            <div className={`${styles.dashboardPage} context-wrapper`}>
                <h1>Dashboard</h1>
                <p>Hello {loggedUserData?.user_settings?.username}. Welcome to your dashboard.</p>
                <button onClick={handleSignOutButton}>Sign Out</button>
                <p>sada</p>
                <p>sajdas</p>
                <p>sjadjasd</p>
            </div>
        </AuthWrapper>
    );
}

export default Dashboard;