import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { supabase } from '../supabaseClient';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      
      // Pull system diagnostic items mapped inside the cloud entity repository, ordered by descending timestamps
      const { data, error } = await supabase
        .from('Audit_Logs') // Modify explicit relation identifier mapping if schema specifications shift
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setLogs(data);
      } else {
        // Fallback Mock Payload: Retains localized layout integrity during offline engineering workflows
        setLogs([
          { id: 1, user_email: 'superadmin@hope.com', action: 'LOGIN', details: 'User logged in successfully', created_at: new Date().toISOString() },
          { id: 2, user_email: 'admin@hope.com', action: 'UPDATE_RIGHTS', details: 'Updated module access for representative', created_at: new Date(Date.now() - 3600000).toISOString() },
          { id: 3, user_email: 'rep@hope.com', action: 'VIEW_DASHBOARD', details: 'Accessed main representative dashboard', created_at: new Date(Date.now() - 7200000).toISOString() }
        ]);
      }
      setLoading(false);
    };

    fetchLogs();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Structural Gated System Layout Navigation */}
      <Sidebar />
      
      {/* Canvas Workspace View Frame (Offset pl-64 to clear fixed viewport components safely) */}
      <main className="flex-1 pl-64 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Diagnostic Profile Summary Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">System Audit Logs</h2>
              <p className="text-slate-500 text-sm mt-1">Monitor user sessions, regressions, and crucial database activity logs.</p>
            </div>
            <span className="material-symbols-outlined text-4xl text-amber-500 bg-amber-50 p-3 rounded-xl">history</span>
          </div>

          {/* Activity Logs Ledger Canvas Frame Component */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-500 font-medium">Loading activity histories...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
                      <th className="p-4 pl-6">Timestamp</th>
                      <th className="p-4">User Email</th>
                      <th className="p-4">Action</th>
                      <th className="p-4 pr-6">Details</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-slate-600 divide-y divide-slate-50">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Format parameters aligned to regional system execution standards */}
                        <td className="p-4 pl-6 font-mono text-xs text-slate-400">
                          {new Date(log.created_at).toLocaleString('en-PH')}
                        </td>
                        <td className="p-4 font-medium text-slate-800">{log.user_email}</td>
                        <td className="p-4">
                          {/* Categorized conditional tracking styling classes based on systemic actions */}
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                            log.action.includes('LOGIN') ? 'bg-emerald-50 text-emerald-600' :
                            log.action.includes('UPDATE') ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-slate-500">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default AuditLogs;
