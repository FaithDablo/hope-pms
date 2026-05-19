import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRights } from '../context/UserRightsContext';

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useRights();

  // Habang naglo-load pa ang permissions mula sa Supabase, magpakita ng loading screen
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-medium text-sm">Checking security clearances...</p>
        </div>
      </div>
    );
  }

  // Kung HINDI Admin o Superadmin, harangan at ibalik sa dashboard!
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Kung Admin/Superadmin naman, papasukin sa protected page
  return children;
};

export default AdminRoute;