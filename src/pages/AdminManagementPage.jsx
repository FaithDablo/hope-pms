import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Babasahin ang live user table na galing sa database setup ni Eunice
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .order('userid', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching directory:', err.message);
      setErrorMsg('Security database validation error. Check server parameters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const { error } = await supabase
        .from('user')
        .update({ record_status: nextStatus })
        .eq('userid', id);

      if (error) throw error;
      setUsers(prev => prev.map(u => u.userid === id ? { ...u, record_status: nextStatus } : u));
    } catch (err) {
      alert(`Operation Blocked: Policy restricts database adjustment. (${err.message})`);
    }
  };

  return (
    <div className="font-['Inter']">
      <div className="flex items-center gap-3 mb-2">
        <span className="px-3 py-1 text-[10px] font-black uppercase bg-indigo-100 text-indigo-800 rounded-md">
          Security Core Module
        </span>
        <h1 className="text-3xl font-bold text-slate-950">User Management Console</h1>
      </div>
      <p className="text-slate-500 text-sm mb-8">
        Review system access parameters, manage account operational lifecycles, and audit active directories.
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : errorMsg ? (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
          {errorMsg}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0b1c30] text-white text-[11px] uppercase tracking-widest font-semibold">
                  <th className="py-4 px-6">User ID</th>
                  <th className="py-4 px-6">Username</th>
                  <th className="py-4 px-6">Account Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((account) => {
                  const isSuperAdmin = account.user_type === 'SUPERADMIN';

                  return (
                    <tr key={account.userid} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 text-sm font-mono text-slate-600">{account.userid}</td>
                      <td className="py-4 px-6 text-sm font-semibold text-slate-900">{account.username}</td>
                      <td className="py-4 px-6 text-sm">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide ${
                          isSuperAdmin ? 'bg-purple-100 text-purple-700' :
                          account.user_type === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {account.user_type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span className={`inline-flex items-center gap-1.5 font-medium ${
                          account.record_status === 'ACTIVE' ? 'text-emerald-600' : 'text-slate-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            account.record_status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'
                          }`} />
                          {account.record_status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-center">
                        {isSuperAdmin ? (
                          <div className="relative group inline-block">
                            <div className="flex gap-2 opacity-40 cursor-not-allowed">
                              <button disabled className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-lg text-xs font-semibold">Activate</button>
                              <button disabled className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-lg text-xs font-semibold">Deactivate</button>
                            </div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-950 text-white text-[11px] py-1.5 px-3 rounded-lg whitespace-nowrap shadow-xl font-medium tracking-wide z-10">
                              SUPERADMIN accounts cannot be modified
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950"></div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => toggleStatus(account.userid, account.record_status)}
                              disabled={account.record_status === 'ACTIVE'}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                                account.record_status === 'ACTIVE'
                                  ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                              }`}
                            >
                              Activate
                            </button>
                            <button
                              onClick={() => toggleStatus(account.userid, account.record_status)}
                              disabled={account.record_status === 'INACTIVE'}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                                account.record_status === 'INACTIVE'
                                  ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                                  : 'bg-red-50 text-red-600 hover:bg-red-100'
                              }`}
                            >
                              Deactivate
                            </button>
                          </div>
                        )}
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
  );
}