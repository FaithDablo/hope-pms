import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; 

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      
      const { data, error } = await supabase
        .from('user')
        .select('userid, username, firstname, lastname, user_type, record_status')
        .order('userid', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err.message);
      setErrorMsg('Failed to fetch system user directories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus, userType) => {
    if (userType === 'SUPERADMIN') {
      alert('Violation: SUPERADMIN accounts cannot be modified.');
      return;
    }

    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    try {
      setActionLoading(userId);
      setErrorMsg(null);
      setSuccessMsg(null);

      const { error } = await supabase
        .from('user')
        .update({ record_status: newStatus })
        .eq('userid', userId);

      if (error) throw error;

      setSuccessMsg(`User [${userId}] status updated to ${newStatus} successfully!`);
      setUsers(prevUsers =>
        prevUsers.map(u => (u.userid === userId ? { ...u, record_status: newStatus } : u))
      );
    } catch (err) {
      console.error('Error updating status:', err.message);
      setErrorMsg(`Failed to modify status for user ${userId}. Check database RLS policies.`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    // ITO ANG PINALITAN NATIN: Nilagyan natin ng wrapper para hindi sumabog ang layout
    <div className="w-full h-full p-1 transition-all duration-300">
      <div className="max-w-[1200px] mx-auto"> 
        
        {/* Header Dashboard Grid */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 text-[10px] font-black uppercase bg-indigo-100 text-indigo-800 rounded-md tracking-wider">
              Admin Management Module
            </span>
            <h1 className="text-3xl font-bold text-slate-950">User Identity Core</h1>
          </div>
          <p className="text-slate-500 text-sm">
            Manage system account credentials, authorization roles, and toggle platform access controls.
          </p>
        </div>

        {/* Real-time Alerts Block */}
        {successMsg && (
          <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            {errorMsg}
          </div>
        )}

        {/* Main Table Interface */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-400 text-sm shadow-sm italic font-medium">
            No user profiles mapped.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0b1c30] text-white text-[11px] uppercase tracking-widest font-bold">
                    <th className="py-4 px-6">User ID</th>
                    <th className="py-4 px-6">Full Name</th>
                    <th className="py-4 px-6">Username / Email</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((account) => {
                    const isSuperAdmin = account.user_type === 'SUPERADMIN';
                    const isActive = account.record_status === 'ACTIVE';
                    return (
                      <tr key={account.userid} className="hover:bg-slate-50/60">
                        <td className="py-4 px-6 text-sm font-bold text-slate-600 font-mono">{account.userid}</td>
                        <td className="py-4 px-6 text-sm font-semibold text-slate-900">{account.firstname} {account.lastname}</td>
                        <td className="py-4 px-6 text-sm text-slate-500">{account.username}</td>
                        <td className="py-4 px-6 text-xs font-bold">
                          <span className={`px-2.5 py-1 rounded-full uppercase border ${isSuperAdmin ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                            {account.user_type}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs font-bold">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
                            {account.record_status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleToggleStatus(account.userid, account.record_status, account.user_type)}
                            disabled={isSuperAdmin || actionLoading === account.userid}
                            className={`px-4 py-1.5 font-bold text-xs rounded-lg ${isSuperAdmin ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : isActive ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}
                          >
                            {actionLoading === account.userid ? '...' : isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}