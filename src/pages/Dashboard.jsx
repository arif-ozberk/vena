import React, { useContext, useState, useEffect } from 'react';

// Styles
import styles from "../sass/dashboardPage_styles/Dashboard.module.scss";

// Components
import LivePulseOximeterApp from '../components/dashboardPage_components/LivePulseOximeterApp';
import DailyMetricsApp from '../components/dashboardPage_components/DailyMetricsApp';
import RecentDataApp from '../components/dashboardPage_components/RecentDataApp';
import CalendarApp from '../components/dashboardPage_components/CalendarApp';

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

// React-Icons
import { IoNotificationsCircle } from "react-icons/io5";


const Dashboard = () => {

    const {
        loggedUserData, setLoggedUserData,
        setUserSession,
        setIsAuthenticated,
        setIsSessionLoading
    } = useContext(AuthContext);

    

    return (
        <AuthWrapper>
            <div className={`${styles.dashboardPage} context-wrapper`}>
                <div className={styles.greetingContainer}>
                    <p>Hello {loggedUserData?.user_settings?.username}. Welcome to your dashboard.</p>
                    <IoNotificationsCircle />
                </div>

                <div className={styles.topContainer}>
                    <div className={`${styles.div1} ${styles.gridSection}`}>
                        <LivePulseOximeterApp />
                    </div>
                    <div className={`${styles.div2} ${styles.gridSection}`}>
                        <DailyMetricsApp />
                    </div>
                </div>

                <div className={styles.bottomContainer}>
                    <div className={`${styles.div3} ${styles.gridSection}`}>
                        <RecentDataApp />
                    </div>
                    <div className={`${styles.div4} ${styles.gridSection}`}>
                        <CalendarApp />
                    </div>
                </div>
            </div>
        </AuthWrapper>
    );
};

export default Dashboard;