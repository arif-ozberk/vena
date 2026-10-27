import React from 'react';

// Styles
import styles from "../../sass/sharedComponent_styles/Loader.module.scss";


const Loader = () => {
    return (
        <div className={styles.loader}>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
        </div>
    );
}

export default Loader;