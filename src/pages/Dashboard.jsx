import React, { useState } from 'react';

const UserManagement = () => {
  // PR-02 Mock Data: Initializing sample data models to test row-level SUPERADMIN security guards
  const [users, setUsers] = useState([
    { id: 1, full_name: "Faith Dablo (TL)", email: "faye.dablo@gmail.com", user_type: "SUPERADMIN" },
    { id: 2, full_name: "Princess Pulgo", email: "princess@hope-pms.com", user_type: "ADMIN" },
    { id: 3, full_name: "Staff Member", email: "staff@hope-pms.com", user_type: "USER" }
  ]);

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation Trail */}
      <div className="text-sm text-slate-500 flex items-center gap-2">
        Dashboard <span className="material-symbols-outlined text-xs">chevron_right</span> <span className="text-indigo-600">User Management Guard</span>
      </div>

      {/* Page Layout Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-3xl text-indigo-950">System Users</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            <span className="material-symbols-outlined">add</span> New User
          </button>
        </div>
      </div>

      {/* Statistical Overview Metric Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="TOTAL ACCOUNTS" value={users.length.toString()} icon="group" />
        <StatCard title="SUPERADMIN STATUS" value="1 LOCKED" icon="lock" action="Protected" />
        <StatCard title="SYSTEM SECURITY" value="100%" icon="shield" change="ACTIVE" />
      </div>

      {/* Main Table View Canvas — Implements PR-02 Action Gating Restrictions */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Tab label="All Users" active />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-semibold tracking-wider uppercase">
                <th className="p-4">Full Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Role / Type</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((targetUser) => {
                // 1. Evaluate if the row target is an immutable root database entity
                const isSuperAdminRow = targetUser.user_type === 'SUPERADMIN';

                return (
                  <tr key={targetUser.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-900">{targetUser.full_name}</td>
                    <td className="p-4 text-sm text-slate-600">{targetUser.email}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isSuperAdminRow ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-indigo-50 text-indigo-700'
                      }`}>
                        {targetUser.user_type}
                      </span>
                    </td>
                    <td className="p-4">
                      {/* Native DOM wrapper handles structural hover titles safely.
                        Provides contextual user feedback explanation when interactive states are disabled.
                      */}
                      <div 
                        className="flex items-center justify-center gap-2" 
                        title={isSuperAdminRow ? "SUPERADMIN accounts cannot be modified" : undefined}
                      >
                        {/* EDIT ACTION GATE */}
                        <button
                          disabled={isSuperAdminRow}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isSuperAdminRow 
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50' 
                              : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-95'
                          }`}
                        >
                          Edit
                        </button>

                        {/* DELETE ACTION GATE */}
                        <button
                          disabled={isSuperAdminRow}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isSuperAdminRow 
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50' 
                              : 'bg-red-50 text-red-600 hover:bg-red-100 active:scale-95'
                          }`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Layout Helper Sub-component: Summary Cards Dashboard Unit
const StatCard = ({ title, value, change, icon, action }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between gap-4">
    <div className="flex flex-col gap-1">
      <p className="text-xs text-slate-500 tracking-wider uppercase">{title}</p>
      <p className="font-bold text-3xl text-indigo-950">{value}</p>
    </div>
    <div className="flex flex-col items-end gap-3 text-right">
      <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      {change && <span className="font-medium text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">{change}</span>}
      {action && <span className="font-medium text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">{action}</span>}
    </div>
  </div>
);

// Layout Helper Sub-component: Table Filtering Controls
const Tab = ({ label, active }) => (
  <button className={`px-4 py-2 font-medium rounded-lg text-sm ${active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}>
    {label}
  </button>
);

export default UserManagement;
