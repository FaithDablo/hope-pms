import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRights } from '../context/UserRightsContext';

const Sidebar = () => {
  const { signOut } = useAuth();
  const { isAdmin, loading } = useRights();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Helper utility to determine active style states for menu links
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 h-screen bg-indigo-950 text-slate-300 flex flex-col justify-between p-6 fixed left-0 top-0 border-r border-indigo-900/50 shadow-xl">
      <div className="space-y-8">
        {/* Branding Configuration Header */}
        <div className="flex items-center gap-3 px-2">
          <span className="material-symbols-outlined text-indigo-400 text-3xl">medical_services</span>
          <h1 className="font-bold text-xl text-white tracking-wide">HOPE PMS</h1>
        </div>

        {/* Dynamic Navigation Panel */}
        <nav className="flex flex-col gap-2">
          {/* 1. PUBLIC / GENERAL LINKS: Accessible by all active authenticated sessions */}
          <Link
            to="/dashboard"
            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${
              isActive('/dashboard')
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'hover:bg-indigo-900/50 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined">dashboard</span> Dashboard
          </Link>

          {/* 2. PROTECTED MODULE LINKS: Gated strictly by user rights mapping */}
          {/* Suppress rendering while state loads. Mount routes only if administrative credentials match */}
          {!loading && isAdmin && (
            <>
              <Link
                to="/users"
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive('/users')
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'hover:bg-indigo-900/50 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined">group</span> User Management
              </Link>

              <Link
                to="/settings"
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive('/settings')
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'hover:bg-indigo-900/50 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined">settings</span> System Settings
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Terminal Workspace Logout Interaction Anchor */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-slate-400 hover:bg-red-950/40 hover:text-red-400 transition-all border border-transparent hover:border-red-900/30"
      >
        <span className="material-symbols-outlined">logout</span> Logout
      </button>
    </div>
  );
};

export default Sidebar;
