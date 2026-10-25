import React from 'react'

// Styles
import styles from "../sass/userSettingsPage_styles/UserSettingsPage.module.scss";

// Wrappers
import AuthWrapper from '../wrappers/AuthWrapper';


const UserSettingsPage = () => {
    return (
        <AuthWrapper>
            <div className={`${styles.userSettingsPage} context-wrapper`}>
                <h1>UserSettingsPage</h1>
            </div>
        </AuthWrapper>
    );
}

export default UserSettingsPage;