import React from 'react';
import styles from './Header.module.css'; 

function Header() {
    return (
        <header className={styles.logoHeader}>
            <div className={styles.logoHeaderContainer}>
                <img src={'src/assets/logoText.svg'} alt="Trackit logo" />
            </div>
        </header>
    );
}

export default Header;