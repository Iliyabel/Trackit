import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AuthProvider from './components/AuthProvider';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/" element={<LoginPage />} /> 
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;