import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // add authentication logic here
        navigate('/dashboard');
    };

    const handleSignup = () => {
        // add authentication logic here
        navigate('/register');
    };

    return (
        <div>
            <div className="LoginContainer">
                <img className="login-logo" src={'src/assets/logoText.svg'} alt="Trackit logo" />
                <div className="LeftSide">
                    <div className='login-box'>
                        <h1>Sign In</h1>
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

                        <button className="login-button" onClick={handleLogin}>
                            Login
                        </button>
                    </div>

                </div>
            </div>

            <div className="RightSide">
                <div className="register-box">
                    <h1>No Account?</h1>
                    <h2>Please Register</h2>

                    <button className="register-button" onClick={handleSignup}>
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;