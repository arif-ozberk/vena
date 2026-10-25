import React from 'react';

// Styles
import styles from "../../sass/sharedComponent_styles/Sidebar.module.scss";

// Assets
import venaLogo from "../../assets/vena-logo.png";

// Routes
import { navLinks } from '../../routes/navLinks';

// React-Icons
import { FaHeartbeat, FaFacebook, FaGoogle, FaGithub, FaUserCircle } from "react-icons/fa";

// React-Router
import { Link } from 'react-router-dom';


const Sidebar = () => {


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
                            ${location.pathname === "/dashboard/heart" && navLink.path === "/dashboard/heart" && styles.navLinkActive}
                            ${location.pathname === "/dashboard/google" && navLink.path === "/dashboard/google" && styles.navLinkActive}
                            ${location.pathname === "/dashboard/facebook" && navLink.path === "/dashboard/facebook" && styles.navLinkActive}
                            ${location.pathname === "/dashboard/github" && navLink.path === "/dashboard/github" && styles.navLinkActive}
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

            <div className={styles.userIcon}>
                <FaUserCircle />
            </div>
        </div>
    );
}

export default Sidebar;