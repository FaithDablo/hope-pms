import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserRightsProvider } from './context/UserRightsContext';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import AuditLogs from './pages/AuditLogs';
import AdminRoute from './components/AdminRoute';

// Temporary placeholder layouts for protected modules 
// (Replace with actual file imports when your specific page components are ready)
const UserManagement = () => <div className="pl-64 p-8"><h2>User Management (Admin Only)</h2></div>;
const Settings = () => <div className="pl-64 p-8"><h2>System Settings (Admin Only)</h2></div>;

function App() {
  return (
    <Router>
      {/* Wrap everything inside authentication and role-gating providers */}
      <AuthProvider>
        <UserRightsProvider>
          <Routes>
            {/* 🌐 PUBLIC ROUTES */}
            {/* Standard Login entry point */}
            <Route path="/login" element={<Login />} />
            
            {/* Dedicated Google OAuth callback listener route */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* 🔓 GENERAL PROTECTED ROUTES */}
            {/* Primary landing view accessible by all active team members */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 🔒 SUPERADMIN / ADMIN RESTRICTED MODULES */}
            {/* Secure endpoints strictly wrapped around the AdminRoute shield */}
            <Route 
              path="/users" 
              element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              } 
            />
            <Route 
              path="/audit-logs" 
              element={
                <AdminRoute>
                  <AuditLogs />
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

            {/* 🔄 AUTOMATIC FALLBACK */}
            {/* Redirects any unknown or unmapped paths back to the authentication portal */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </UserRightsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
