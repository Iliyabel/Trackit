import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthProvider';
import LoginCard from '../components/LoginCard';
import styles from './LoginPage.module.css'
import logoText from '../assets/LogoText.svg'; 

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
                <img src={logoText} alt="Logo" className={styles.logo} />
                <div className={styles.leftPanel}>
                    <LoginCard newUser={newUser} setNewUser={setNewUser} className={styles.loginCard} />
                </div>
                <div className={styles.rightPanel}>
                    <div className={styles.registerBox}>
                        {newUser ? (
                        <>
                            <h1>Already Have an Account?</h1>
                            <h2>Sign in here</h2>
                        </>
                        ) : (
                        <>
                            <h1>No Account?</h1>
                            <h2>Sign up to get started</h2>
                        </>
                        )}
                        <button className={styles.registerButton} onClick={() => setNewUser(!newUser)}>
                            {!newUser ? 'Sign Up' : 'Sign In'}
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
}

export default LoginPage;