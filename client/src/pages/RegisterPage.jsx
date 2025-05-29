import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function RegisterPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
    // add data save and validation logic here
    navigate('/dashboard');
    };

    return (
        <div>
            <header className='logo-header'>
                <img className="logo" src={'src/assets/logoText.svg'} alt="Trackit logo"/>
            </header>

            <div className="register-container">
                <div className='login-box'>
                    <div className='logo-title'>
                        <img className="plain-logo" src={'src/assets/logo.svg'} alt="Trackit logo"/>
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

                    <button className="login-button" onClick={handleRegister}>
                    Create Account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;