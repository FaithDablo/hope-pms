import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserRightsProvider } from './context/UserRightsContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserRightsProvider>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Main Application Route */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Fallback: Kapag maling URL, babalik sa login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </UserRightsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;