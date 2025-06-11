import React, { useState, useContext, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginCard.module.css';
import Modal from './Modal.jsx';
import { AuthContext } from './AuthProvider.jsx';
import { postUserProfile } from '../util/ApiProvider.js'; 

function LoginCard({ newUser, setNewUser, ...props }) {
    const navigate = useNavigate();
    const { user, login, register, resetPassword } = useContext(AuthContext);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [authError, setAuthError] = useState(null);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [resetPasswordEmailSent, setResetPasswordEmailSent] = useState(false);
    const [modalError, setModalError] = useState(null);

    let emailRegex = /^.+@.+\..+$/;

    function validateFields() {
        setAuthError(null);
        const errors = {};
        if (!email || !emailRegex.test(email)) errors.email = 'Valid email is required';
        if (!password) errors.password = 'Password is required';
        if (newUser) {
            if (!firstName) errors.firstName = 'First name is required';
            if (!lastName) errors.lastName = 'Last name is required';
            if (!errors.password && password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
            if (!errors.password && password.length < 8) errors.password = 'Password must be at least 8 characters';
            if (!errors.password && 
                (/[a-z]/.test(password) === false || 
                /[A-Z]/.test(password) === false || 
                /[!@#$%^&*]/.test(password) === false)) 
                errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one special character';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }

    let inputMaxLength = 50;

    const handleLogin = async () => {
        if(!validateFields()) return;
        try {
            await login(email, password);
        } catch (error) {
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    setAuthError('Invalid email or password');
                    break;
                case 'auth/too-many-requests':
                    setAuthError('Too many failed login attempts. Please try again later.');
                    break;
                default:
                    setAuthError(`Login failed: ${error.message}`);
            }
        }
    };

    const handleRegister = async () => {
        if(!validateFields()) return;
        try {
            const token = await register(email, password)
                .then((userCredential) => userCredential.user.getIdToken());
            await postUserProfile(token, {
                firstName: firstName,
                lastName: lastName,
                email: email
            });
        } catch (error) {
            if( error.code === 'auth/email-already-in-use') {
                setAuthError('Email already in use. Please use a different email.');
            } else{
                setAuthError(`Registration failed: ${error.message}`);
            }
        }
    };

    const handleForgotPassword = async () => {
        setModalError(null);
        if (!email || !emailRegex.test(email)) {
            setModalError('Please enter a valid email address.');
            return;
        }
        try {
            await resetPassword(email);
            setResetPasswordEmailSent(true);
        } catch (error) {
            if (error.code === 'auth/invalid-email') {
                setModalError('Please enter a valid email address.');
            } else {
                setModalError(`${error.message}`);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newUser) {
            handleRegister();
        } else {
            handleLogin();
        }
    };

    let form = !newUser ?
        <>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${styles.loginInput} ${fieldErrors.email ? styles.errorInput : ''}`}
                maxLength={inputMaxLength}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.loginInput} ${fieldErrors.password ? styles.errorInput : ''}`}
                maxLength={inputMaxLength}
            />
            </>
        :
            <>
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`${styles.loginInput} ${fieldErrors.firstName ? styles.errorInput : ''}`}
                maxLength={inputMaxLength}
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`${styles.loginInput} ${fieldErrors.lastName ? styles.errorInput : ''}`}
                maxLength={inputMaxLength}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${styles.loginInput} ${fieldErrors.email ? styles.errorInput : ''}`}
                maxLength={inputMaxLength}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.loginInput} ${fieldErrors.password ? styles.errorInput : ''}`}
                maxLength={inputMaxLength}
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${styles.loginInput} ${fieldErrors.confirmPassword ? styles.errorInput : ''}`}
                maxLength={inputMaxLength}
            />
            </>
        ;


    return (
        <>
        <div className={styles.card}>
            <div>
                <img src="src/assets/logo.svg" alt="Logo" className={styles.logo} />
            </div>
            <form className={styles.form} onKeyDown={(event) => {if (event.key === 'Enter') {handleSubmit(event)}}} onSubmit={handleSubmit}>
                {form}
                {authError && <div className={styles.error}><p>{authError}</p></div>}
                {Object.keys(fieldErrors).length > 0 && (
                    <ul className={styles.invalidFields}>
                        {Object.entries(fieldErrors).map(([key, error]) => (
                            <li key={key}>{error}</li>
                        ))}
                    </ul>
                )}
                <p className={styles.textButton} onClick={newUser ? () => setNewUser(false) : () => setForgotPassword(true)}>{newUser ? 'Already have an account?' : 'Forgot Password?'}</p>
                <button type='submit' className={styles.button}>
                    {newUser ? 'Register' : 'Login'}
                </button>
            </form>
        </div>

        {forgotPassword && (
            <Modal isOpen={forgotPassword} onClose={() => {setForgotPassword(false); setResetPasswordEmailSent(false); setModalError(false);}} title="Reset Password" className={styles.modal}>
                <p>Please enter your email address to reset your password.</p>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {if (e.key === 'Enter') { e.preventDefault(); handleForgotPassword(); }}}
                    className={`${styles.loginInput} ${fieldErrors.email ? styles.errorInput : ''}`}
                    maxLength={inputMaxLength}
                    disabled={resetPasswordEmailSent}
                />
                {modalError && <div className={styles.error}><p>{modalError}</p></div>}
                <button
                    onClick={handleForgotPassword}
                    className={`${styles.button} ${resetPasswordEmailSent ? styles.inactive : ''}`}
                    disabled={resetPasswordEmailSent}
                >
                    Reset Password
                </button>
                {resetPasswordEmailSent && <p className={styles.success}>If the email exists, a reset link has been sent.</p>}
            </Modal>
        )}
        </>
    )

}

export default LoginCard;