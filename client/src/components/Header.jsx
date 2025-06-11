import React, { useContext, useState, useEffect } from 'react';
import styles from './Header.module.css'; 
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider.jsx';
import { getUserProfile } from '../util/ApiProvider.js';


function Header() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [initials, setInitials] = useState(null);

    useEffect(() => {
        if (user.isAuthenticated) {
            getUserProfile(user.token)
                .then((profile) => {
                    if (profile) {
                        setInitials(`${profile.firstName.charAt(0).toUpperCase()}${profile.lastName.charAt(0).toUpperCase()}`);
                    } else {
                        setInitials(null);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user profile:', error);
                    setInitials(null);
                });
        }
    }, [user.isAuthenticated]);

    return (
        <header className={styles.header}>
            <img onClick={() => navigate('/')} src={'src/assets/logoText.svg'} alt="Trackit logo" />
            <div className={styles.buttonContainer}>
                {user.isAuthenticated ? (
                    <>
                        {initials && <div className={styles.roundButton}>{initials}</div>}
                        <button className={styles.logoutButton} onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <button className={styles.loginButton} onClick={() => navigate('/login')}>Login</button>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;