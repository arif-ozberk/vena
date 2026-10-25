import React, { useContext, useState, useEffect, useRef } from 'react';

// Styles
import styles from "../../sass/sharedComponent_styles/UserIconPopup.module.scss";

// Assets
import venaLogo from "../../assets/vena-logo.png";

// Routes
import { navLinks } from '../../routes/navLinks';

// React-Icons
import { FaHeartbeat, FaFacebook, FaGoogle, FaGithub, FaUserCircle, FaUserCog } from "react-icons/fa";
import { MdLightMode, MdNightlightRound, MdNotifications, MdNotificationsOff } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";

// React-Router
import { Link, useNavigate } from 'react-router-dom';

// Context
import { AuthContext } from '../../context/AuthContext';
import { UIContext } from '../../context/UIContext';

// Vena-DB
import authDB from '../../config/authDB';
import userSettingsDB from '../../config/userSettingsDB';

// React-Toastify
import { toast } from 'react-toastify';
import toastifyOptions from '../../mocks/toastifyOptions';

const UserIconPopup = ({ popupRef, isUserIconPopupOpen, setIsUserIconPopupOpen }) => {

    const {
        loggedUserData, setLoggedUserData,
        userSession, setUserSession,
        setIsAuthenticated,
        setIsSessionLoading
    } = useContext(AuthContext);


    useEffect(() => {
        const handleClickOutside = (event) => {
            // Only close if navbar is open and clicked element is NOT inside popupRef
            if (isUserIconPopupOpen && popupRef.current && !popupRef.current.contains(event.target)) {
                setIsUserIconPopupOpen(false);
            }
        };

        // Attach listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup listener on unmount or before re-running
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserIconPopupOpen]);


    const handleNotificationSettingButton = () => {
        const currentSettings = loggedUserData?.user_settings?.visual_settings || {};

        const userChanges = {
            visual_settings: {
                ...currentSettings,
                notificationSetting: !currentSettings.notificationSetting
            }
        };

        userSettingsDB.updateUserData(userSession, userChanges, setLoggedUserData);
    }


    const handleColorModeButton = (selectedSetting) => {
        const currentSettings = loggedUserData?.user_settings?.visual_settings || {};

        const userChanges = {
            visual_settings: {
                ...currentSettings,
                isDarkModeOn: selectedSetting
            }
        };

        userSettingsDB.updateUserData(userSession, userChanges, setLoggedUserData);
    }


    const handleLanguageSelectionButton = (selectedLanguage) => {
        const currentSettings = loggedUserData?.user_settings?.visual_settings || {};

        const userChanges = {
            visual_settings: {
                ...currentSettings,
                languageSelection: selectedLanguage
            }
        };

        userSettingsDB.updateUserData(userSession, userChanges, setLoggedUserData);
    }


    const handleSignOutButton = () => {
        authDB.handleSignOut(setUserSession, setIsAuthenticated, setIsSessionLoading, setLoggedUserData);
        toast.success("Signed out successfully", toastifyOptions.darkTopRight);
        navigate("/");
    }


    return (
        <div ref={popupRef} className={`${styles.userIconPopup}`} onClick={(e) => e.stopPropagation()}>
            <IoIosClose
                className={styles.closePopupButton}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsUserIconPopupOpen(false);
                }}
            />
            <p className={styles.usernameText}>Welcome, {loggedUserData?.user_settings.username}</p>
            <div className={styles.visualSettings}>
                <div className={styles.colorModeContainer}>
                    <div
                        className={`
                                    ${styles.colorMode}
                                    ${!loggedUserData?.user_settings.visual_settings.isDarkModeOn && styles.selectedColorMode}
                                `}
                        onClick={() => handleColorModeButton(false)}
                    >
                        <MdLightMode />
                        <p>Light</p>
                    </div>
                    <div
                        className={`
                                    ${styles.colorMode}
                                    ${loggedUserData?.user_settings.visual_settings.isDarkModeOn && styles.selectedColorMode}
                                `}
                        onClick={() => handleColorModeButton(true)}
                    >
                        <MdNightlightRound />
                        <p>Dark</p>
                    </div>
                </div>
                <div className={styles.notificationMode} onClick={handleNotificationSettingButton} >
                    {loggedUserData?.user_settings.visual_settings.notificationSetting ? <MdNotifications /> : <MdNotificationsOff />}
                </div>
            </div>
            <div className={styles.languageSettings}>
                <div
                    className={`
                                ${styles.languageOption}
                                ${loggedUserData?.user_settings.visual_settings.languageSelection == "English" && styles.selectedLanguage}
                            `}
                    onClick={() => handleLanguageSelectionButton("English")}
                >
                    <img src="https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/US.svg" alt="us-flag-img" />
                    <p>English</p>
                </div>
                <div
                    className={`
                                ${styles.languageOption}
                                ${loggedUserData?.user_settings.visual_settings.languageSelection == "Türkçe" && styles.selectedLanguage}
                            `}
                    onClick={() => handleLanguageSelectionButton("Türkçe")}
                >
                    <img src="https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TR.svg" alt="us-flag-img" />
                    <p>Türkçe</p>
                </div>
            </div>
            <Link to="/dashboard/user-settings" className={styles.userSettingsLink}>
                <FaUserCog />
                <p>User Settings</p>
            </Link>
            <button className={styles.signOutButton} onClick={handleSignOutButton}>
                <FiLogOut />
                <p>Sign Out</p>
            </button>
        </div>
    );
}

export default UserIconPopup;