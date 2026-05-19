import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserRightsProvider } from './context/UserRightsContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminRoute from './components/AdminRoute';

// Temporary placeholders para sa protected routes (palitan kung may existing files na kayo)
const UserManagement = () => <div className="pl-64 p-8"><h2>User Management (Admin Only)</h2></div>;
const Settings = () => <div className="pl-64 p-8"><h2>System Settings (Admin Only)</h2></div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserRightsProvider>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* General Protected Route */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 🔒 SUPERADMIN / ADMIN ONLY ROUTES */}
            <Route 
              path="/users" 
              element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <AdminRoute>
                  <Settings />
                </AdminRoute>
              } 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </UserRightsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;