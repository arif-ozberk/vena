import React, { useState, useRef, useEffect } from 'react';

// Styles
import styles from "../../sass/sharedComponent_styles/MobileNavbar.module.scss";

// Components
import UserIconPopup from './UserIconPopup';

// React-Icons
import { HiMenuAlt2 } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { GoChevronDown } from "react-icons/go";

// Assets
import venaLogo from "../../assets/vena-logo.png";

// React-Router
import { Link } from 'react-router-dom';

// Router
import { navLinks } from '../../routes/navLinks';


const MobileNavbar = () => {

    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [isUserIconPopupOpen, setIsUserIconPopupOpen] = useState(false);

    const navbarRef = useRef(null);
    const popupRef = useRef(null);


    const handleNavbarButton = () => {
        setIsNavbarOpen(prev => !prev);
    }


    // Function that colapses navbar when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Only close if navbar is open and clicked element is NOT inside navbarRef
            if (isNavbarOpen && navbarRef.current && !navbarRef.current.contains(event.target)) {
                setIsNavbarOpen(false);
            }
        };

        // Attach listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup listener on unmount or before re-running
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isNavbarOpen]);


    return (
        <div
            ref={navbarRef}
            className={`${styles.mobileNavbar} ${isNavbarOpen ? styles.navbarOpen : ""}`}
        >
            <div className={styles.navbarTop}>
                {!isNavbarOpen ? 
                    <HiMenuAlt2 className={styles.navbarButton} onClick={handleNavbarButton} /> :
                    <GoChevronDown className={styles.navbarButton} onClick={handleNavbarButton} />
                }
                <Link to="/" className={styles.venaLogo}>
                    <img src={venaLogo} alt="vena-logo-img" />
                    <p>Vena</p>
                </Link>
                <div
                    className={styles.userIcon}
                    onClick={(e) => {
                        if (popupRef.current && popupRef.current.contains(e.target)) return;
                        setIsUserIconPopupOpen(prev => !prev);
                    }}
                >
                    <FaUserCircle />
                    {isUserIconPopupOpen && <UserIconPopup
                        popupRef={popupRef}
                        isUserIconPopupOpen={isUserIconPopupOpen}
                        setIsUserIconPopupOpen={setIsUserIconPopupOpen}
                    />}
                </div>
            </div>

            <div className={styles.navbarBottom}>
                {navLinks.map((navLink, index) => (
                    <Link
                        key={index}
                        to={navLink.path}
                        className={`
                            ${styles.navLink}
                            ${location.pathname === "/dashboard" && navLink.path === "/dashboard" && styles.navLinkActive}
                            ${location.pathname === "/dashboard/heart" && navLink.path === "/dashboard/heart" && styles.navLinkActive}
                            ${location.pathname === "/dashboard/google" && navLink.path === "/dashboard/google" && styles.navLinkActive}
                            ${location.pathname === "/dashboard/facebook" && navLink.path === "/dashboard/facebook" && styles.navLinkActive}
                            ${location.pathname === "/dashboard/github" && navLink.path === "/dashboard/github" && styles.navLinkActive}
                        `}
                    >
                        {navLink.icon}
                        <p>{navLink.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default MobileNavbar;