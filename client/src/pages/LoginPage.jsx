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
        <div className="LeftSide">
            <div className='login-box'>
                <h1>Sign In</h1>

                <button className="login-button" onClick={handleLogin}>
                Login
                </button>
            </div>

        </div>

        <div className="RightSide">
            <div className="register-box">
                <h1>No Account?</h1>
                <h2>Please Register</h2>

                <button className="register-button" onClick={handleSignup}>
                Register
                </button>
            </div>
        </div>
    </div>
  );
}

export default LoginPage;