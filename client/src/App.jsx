import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AuthProvider from './components/AuthProvider';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          { <Route path="/dashboard" element={<DashboardPage />} />}
          <Route path="/" element={<LoginPage />} /> 
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;