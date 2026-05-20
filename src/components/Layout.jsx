import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; 

import ProductListPage from '../pages/ProductListPage';
import ProductReportPage from '../pages/ProductReportPage';
import UserManagementPage from '../pages/UserManagementPage';
import TopSellingPage from '../pages/TopSellingPage';

const Layout = ({ userRole: initialUserRole }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('Product List'); 

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

  const userRole = initialUserRole || user?.user_metadata?.role || 'USER';
  const isAdminOrSuper = userRole === 'ADMIN' || userRole === 'SUPERADMIN';
  const isSuperAdmin = userRole === 'SUPERADMIN';

  // Ipinapasa ang searchQuery prop sa lahat ng components
  const navLinks = [
    { icon: 'inventory_2', label: 'Product List', component: <ProductListPage searchQuery={searchQuery} /> },
    ...(isAdminOrSuper ? [
      { icon: 'description', label: 'Product Report', component: <ProductReportPage searchQuery={searchQuery} /> },
      { icon: 'admin_panel_settings', label: 'User Management', component: <UserManagementPage /> }
    ] : []),
    ...(isSuperAdmin ? [
      { icon: 'trending_up', label: 'Top Selling Products', component: <TopSellingPage searchQuery={searchQuery} /> }
    ] : []),
  ];

  const activeComponent = navLinks.find(link => link.label === activeView)?.component || <ProductListPage searchQuery={searchQuery} />;
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest User';

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 border-r border-slate-200 bg-white p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 rounded-xl bg-indigo-600 text-white">
            <span className="material-symbols-outlined text-2xl">inventory_2</span>
          </div>
          <div>
            <h1 className="font-bold text-xl text-indigo-950">ProManage</h1>
            <p className="text-sm text-slate-500">Enterprise Suite V2.0</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => (
            <button 
              key={link.label}
              onClick={() => setActiveView(link.label)}
              className={`w-full flex items-center justify-start text-left gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                activeView === link.label ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined min-w-[24px] text-center">{link.icon}</span> 
              <span className="text-sm truncate">{link.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Global Header na may Central Search Bar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="relative w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              type="search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products across all modules..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700" 
            />
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="font-semibold text-indigo-950 capitalize text-sm">{displayName}</p>
              <p className="text-[11px] font-bold text-indigo-600 tracking-wide uppercase">{userRole} ACCESS</p>
            </div>
            <button onClick={handleLogout} className="p-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 bg-slate-100">
          {activeComponent}
        </main>
      </div>
    </div>
  );
};

export default Layout;