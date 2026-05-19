import { useState, useEffect, cloneElement } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase'; 

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null); 
  const [searchQuery, setSearchQuery] = useState(''); 

  // Fixed the unclosed useEffect and session logic
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setUser(session.user);
      }
    };
    
    getSession();
  }, [navigate]);

  const userRole = user?.user_metadata?.role || 'USER';
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';
  
  // Create a display name safely
  const displayName = user?.user_metadata?.full_name || user?.email || 'User';

  const navLinks = [
    { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { icon: 'inventory_2', label: 'Product List', path: '/products' }, 
    { icon: 'bar_chart', label: 'Reports', path: '/reports' },
    
    // PR-04: Sidebar 'Deleted Items' (Conditional for Admin)
    ...(isAdmin ? [
      { icon: 'delete_sweep', label: 'Deleted Items', path: '/deleted-items' }
    ] : []),
    
    { icon: 'admin_panel_settings', label: 'Admin', path: '/admin' },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-3 py-2 font-bold text-indigo-600 text-xl">
            <span className="material-symbols-outlined">store</span> Inventory App
          </div>
          
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <button 
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-colors ${
                  location.pathname === link.path 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined">{link.icon}</span> 
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <button 
            onClick={() => navigate('/products')} 
            className="w-full flex items-center justify-center gap-3 p-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            <span className="material-symbols-outlined">add</span> New Product
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="relative w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              type="search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by code or name..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700" 
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <div className="text-right">
                <p className="font-semibold text-indigo-950 capitalize">{displayName}</p>
                <p className="text-xs text-slate-500">{user ? `${userRole} Access` : 'Guest'}</p>
              </div>
              <img 
                src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user?.id || 'default'}`} 
                className="w-10 h-10 rounded-full bg-slate-100" 
                alt="Avatar" 
              />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-auto p-8">
          {/* Dynamically pass searchQuery props down to page components */}
          {cloneElement(children, { searchQuery })}
        </main>
      </div>
    </div>
  );
};

export default Layout;
