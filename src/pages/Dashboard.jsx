import React from 'react';
import Sidebar from '../components/Sidebar'; // Siguraduhing tama ang daan papunta kay Sidebar
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* 1. Ipasok ang ating Gated Sidebar */}
      <Sidebar />

      {/* 2. Main Content Area ng Dashboard (May offset na pl-64 para hindi matakpan ng Sidebar) */}
      <main className="flex-1 pl-64 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Header Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Welcome back, Representative!</h2>
              <p className="text-slate-500 text-sm mt-1">Logged in as: <span className="font-semibold text-indigo-600">{user?.email}</span></p>
            </div>
            <span className="material-symbols-outlined text-4xl text-indigo-500 bg-indigo-50 p-3 rounded-xl">waving_hand</span>
          </div>

          {/* Stat Cards Simulation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <span className="material-symbols-outlined text-indigo-500 bg-indigo-50 p-2 rounded-lg">analytics</span>
              <h3 className="text-slate-400 font-medium text-sm mt-3">System Version</h3>
              <p className="text-2xl font-bold text-slate-800 mt-1">v2.0.26</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <span className="material-symbols-outlined text-emerald-500 bg-emerald-50 p-2 rounded-lg">shield</span>
              <h3 className="text-slate-400 font-medium text-sm mt-3">Security Modules</h3>
              <p className="text-2xl font-bold text-slate-800 mt-1">Active</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <span className="material-symbols-outlined text-amber-500 bg-amber-50 p-2 rounded-lg">badge</span>
              <h3 className="text-slate-400 font-medium text-sm mt-3">Current Role</h3>
              <p className="text-2xl font-bold text-slate-800 mt-1">{user?.user_metadata?.role || 'User'}</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;