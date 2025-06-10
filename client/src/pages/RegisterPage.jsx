import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import authService from '../util/auth';
import Header from '../components/Header';

function RegisterPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            await authService.register(email, password);
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className="register-page">
            <Header></Header>

            <div className="register-container">
                <div className="login-box">
                    <div className="logo-title">
                        <img className="plain-logo" src={'src/assets/logo.svg'} alt="Trackit logo" />
                        <h1>Create An Account</h1>
                    </div>

                    <hr />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                    />

                    <button className="button-primary" onClick={handleRegister}>
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;