import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRights } from '../context/UserRightsContext';
import { supabase } from '../lib/supabase';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rights, loading } = useRights();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest User';

  return (
    <div className="min-h-screen flex bg-slate-50 font-['Inter']">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-200 bg-white p-6 hidden md:flex flex-col justify-between">
        <div>
          {/* Header Branding */}
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 rounded-xl bg-indigo-600 text-white">
              <span className="material-symbols-outlined text-2xl">inventory_2</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-indigo-950">ProManage</h1>
              <p className="text-sm text-slate-500">Enterprise Suite V2.0</p>
            </div>
          </div>

          {/* Navigation Links with Gating */}
          <nav className="space-y-2">
            <button 
              onClick={() => navigate('/dashboard')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-colors ${location.pathname === '/dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <span className="material-symbols-outlined">dashboard</span> Dashboard
            </button>

            {/* --- SPRINT 3: REPORTS SIDEBAR GATING (PR-01) --- */}
            {(rights?.REP_001 === 1 || rights?.REP_002 === 1) && (
              <div className="pt-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Reports</p>
                
                {rights?.REP_001 === 1 && (
                  <button 
                    onClick={() => navigate('/reports/rep-001')}
                    className={`w-full flex items-center gap-3 p-2 px-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === '/reports/rep-001' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <span className="material-symbols-outlined text-xl">bar_chart</span> Financial Summary
                  </button>
                )}

                {rights?.REP_002 === 1 && (
                  <button 
                    onClick={() => navigate('/reports/rep-002')}
                    className={`w-full flex items-center gap-3 p-2 px-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === '/reports/rep-002' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <span className="material-symbols-outlined text-xl">analytics</span> Stock Audit Logs
                  </button>
                )}
              </div>
            )}

            {/* --- SPRINT 3: ADMIN MODULE SIDEBAR GATING (PR-01) --- */}
            {rights?.ADM_USER === 1 && (
              <div className="pt-4 border-t border-slate-100 mt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Admin Settings</p>
                <button 
                  onClick={() => navigate('/admin/users')}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium text-red-600 transition-colors ${location.pathname === '/admin/users' ? 'bg-red-50' : 'hover:bg-slate-100'}`}
                >
                  <span className="material-symbols-outlined">admin_panel_settings</span> User Management
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* Logout and Profile at Bottom */}
        <div className="border-t border-slate-100 pt-4">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 font-medium hover:bg-red-50 transition-colors">
            <span className="material-symbols-outlined">logout</span> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="relative w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input type="search" placeholder="Search system settings..." className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-slate-500 hover:text-indigo-600 p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined text-2xl">notifications</span>
            </button>
            <button className="text-slate-500 hover:text-indigo-600 p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined text-2xl">settings</span>
            </button>
            
            {/* DYNAMIC USER PROFILE */}
            <div className="flex items-center gap-3 border-l pl-6 border-slate-100">
              <div className="text-right">
                <p className="font-semibold text-indigo-950 capitalize">{displayName}</p>
                <p className="text-xs text-slate-500">{user ? 'Authorized Access' : 'Guest'}</p>
              </div>
              <img 
                src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user?.id || 'default'}`} 
                alt="Avatar" 
                className="w-11 h-11 rounded-full border-2 border-indigo-50 object-cover" 
              />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-auto p-8 bg-slate-100">
          {loading ? <p className="text-slate-500 font-medium p-4">Loading application gates...</p> : children}
        </main>
      </div>
    </div>
  );
};

export default Layout;