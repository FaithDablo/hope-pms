import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserRightsProvider } from './context/UserRightsContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminRoute from './components/AdminRoute';

// Temporary fallback shell components (Swap with separate dedicated view files upon production release)
const UserManagement = () => <div className="pl-64 p-8"><h2 className="text-xl font-semibold">User Management (Admin Core Only)</h2></div>;
const Settings = () => <div className="pl-64 p-8"><h2 className="text-xl font-semibold">System Settings (Admin Core Only)</h2></div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserRightsProvider>
          <Routes>
            {/* 🌐 Public Route: Authentication Terminal Gateway */}
            <Route path="/login" element={<Login />} />

            {/* 📊 General Protected Route: Shared Authenticated Workspace Workspace */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 🔒 HIGH-PRIVILEGE ADMINISTRATIVE MODULE ENTRIES (GATED BY HOC SECURITY STRATEGY) */}
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

            {/* 🔄 Fallback Redirection Wildcard */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </UserRightsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
