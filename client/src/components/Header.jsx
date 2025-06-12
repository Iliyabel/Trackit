import React, { useContext, useState, useEffect } from 'react';
import styles from './Header.module.css'; 
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider.jsx';
import { getUserProfile } from '../util/ApiProvider.js';
import logo from '../assets/logoText.svg'; // Adjust the path as necessary


function Header() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [initials, setInitials] = useState(null);

    useEffect(() => {
        let isMounted = true; // Flag to prevent state update on unmounted component
        if (user && user.isAuthenticated && user.token) { // Ensure user and token exist
            getUserProfile(user.token, 5) 
                .then((profile) => {
                    if (isMounted) {
                        if (profile && profile.firstName && profile.lastName) {
                            setInitials(`${profile.firstName.charAt(0).toUpperCase()}${profile.lastName.charAt(0).toUpperCase()}`);
                        } else {
                            // Use default icon
                            console.warn("Profile data incomplete or missing name fields:", profile);
                            setInitials(null); // Fallback to default icon
                        }
                    }
                })
                .catch((error) => {
                    if (isMounted) {
                        console.error('Error fetching user profile for initials:', error);
                        setInitials(null); // Fallback to default icon on error
                    }
                });
        } else {
            if (isMounted) {
                setInitials(null); // Clear initials if user is not authenticated
            }
        }
        return () => {
            isMounted = false; 
        };
    }, [user]); 

    const handleAccountClick = () => {
        navigate('/profile'); // Navigate to the AccountPage
    };

    const handleLogoClick = () => {
        if (user && user.isAuthenticated) {
            navigate('/dashboard'); // Navigate to dashboard if logged in
        } else {
            navigate('/login'); // Navigate to login if not logged in
        }
    };
    
    const handleLogoutClick = async () => {
        try {
            await logout();
            navigate('/login'); // Redirect to login page after logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className={styles.header}>
            <img onClick={handleLogoClick} src={logo} alt="Trackit logo" className={styles.logo} />
            <div className={styles.buttonContainer}>
                {user && user.isAuthenticated ? ( // Check user and isAuthenticated
                    <>
                        <div 
                            className={styles.roundButton} 
                            onClick={handleAccountClick} 
                            title="Account Settings" 
                        >
                            {initials ? initials : <img src="/src/assets/profileIcon.svg" alt="Profile" className={styles.profileIconImage} />}
                        </div>
                        <button className={styles.logoutButton} onClick={handleLogoutClick}>Logout</button>
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