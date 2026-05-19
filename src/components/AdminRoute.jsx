import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRights } from '../context/UserRightsContext';

/**
 * Higher-Order Route Guard Component
 * Secures high-privilege endpoints against unauthorized access by evaluating 
 * administrative role states derived from UserRightsContext.
 */
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useRights();

  // 1. Synchronous Load Block: Display a loading indicator while rights are being fetched from Supabase
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          {/* Smooth spinning animated UI graphic element */}
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-medium text-sm">Checking security clearances...</p>
        </div>
      </div>
    );
  }

  // 2. Authorization Failure Guard Block: Restrict non-administrative sessions and redirect to the general workspace
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Authorization Success Block: Permit access to the underlying low-level module layout
  return children;
};

export default AdminRoute;
