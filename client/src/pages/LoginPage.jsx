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
        <h1>Login Page</h1>

        <button onClick={handleSignup}>
        Register
        </button>

        <button onClick={handleLogin}>
        Login
        </button>
    </div>
  );
}

export default LoginPage;