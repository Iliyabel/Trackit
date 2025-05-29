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
                    <h1>Create an Account</h1>
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