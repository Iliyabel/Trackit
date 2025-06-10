import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthProvider';
import LoginCard from '../components/LoginCard';
import styles from './LoginPage.module.css'

function LoginPage() {
    const navigate = useNavigate();

    const [newUser, setNewUser] = useState(false);
    const { user } = React.useContext(AuthContext);

    useEffect(() => {
        if(user.isAuthenticated) {
            navigate('/dashboard');
        }
    }, [user.isAuthenticated]);

    return (
        <>
            <div className={styles.loginPage}>
                <img src="src/assets/LogoText.svg" alt="Logo" className={styles.logo} />
                <div className={styles.leftPanel}>
                    <LoginCard newUser={newUser} setNewUser={setNewUser} className={styles.loginCard} />
                </div>
                <div className={styles.rightPanel}>
                    <div className={styles.registerBox}>
                        {newUser ? (
                        <>
                            <h1>No Account?</h1>
                            <h2>Sign up to get started</h2>
                        </>
                        ) : (
                        <>
                            <h1>Already Have an Account?</h1>
                            <h2>Sign in here</h2>
                        </>
                        )}
                        <button className={styles.registerButton} onClick={() => setNewUser(!newUser)}>
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
}

export default LoginPage;