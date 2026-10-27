import React, { useState, useRef } from 'react';

// Styles
import styles from "../../sass/sharedComponent_styles/Sidebar.module.scss";

// Components
import UserIconPopup from './UserIconPopup';

// Assets
import venaLogo from "../../assets/vena-logo.png";

// Routes
import { navLinks } from '../../routes/navLinks';

// React-Icons
import { FaUserCircle } from "react-icons/fa";


// React-Router
import { Link } from 'react-router-dom';


const Sidebar = () => {

    const popupRef = useRef(null);

    const [isUserIconPopupOpen, setIsUserIconPopupOpen] = useState(false);


    return (
        <div className={styles.sidebar}>
            <Link to="/" className={styles.venaLogo}>
                <img src={venaLogo} alt="vena-logo-img" />
            </Link>

            <div className={styles.navLinks}>
                {navLinks.map((navLink, index) => (
                    <Link
                        key={index}
                        to={navLink.path}
                        className={`
                            ${styles.navLink}
                            ${location.pathname === "/dashboard" && navLink.path === "/dashboard" && styles.navLinkActive}
                            ${location.pathname === "/dashboard/project-report" && navLink.path === "/dashboard/project-report" && styles.navLinkActive}
                            ${location.pathname === "/dashboard/project-components" && navLink.path === "/dashboard/project-components" && styles.navLinkActive}
                            ${location.pathname === "/dashboard/about-vena" && navLink.path === "/dashboard/about-vena" && styles.navLinkActive}
                        `}
                    >
                        {navLink.icon}
                        <div className={styles.activeIndicator}/>
                        <div className={styles.navLinkInfo}>
                            <p>{navLink.name}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div
                className={styles.userIcon}
                onClick={(e) => {
                    if (popupRef.current && popupRef.current.contains(e.target)) return;
                    setIsUserIconPopupOpen(prev => !prev);
                }}
            >
                <FaUserCircle />
                {isUserIconPopupOpen &&
                    <UserIconPopup
                        popupRef={popupRef}
                        isUserIconPopupOpen={isUserIconPopupOpen}
                        setIsUserIconPopupOpen={setIsUserIconPopupOpen} 
                    />
                }
            </div>
        </div>
    );
}

export default Sidebar;