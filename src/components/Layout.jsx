import { useState, useEffect } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase'; 

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const navLinks = [
    { icon: 'inventory_2', label: 'Product List', path: '/dashboard' },
    { icon: 'bar_chart', label: 'Reports', path: '/reports' },
    { icon: 'admin_panel_settings', label: 'Admin', path: '/admin' },
  ];

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest User';

  return (
    <div className="min-h-screen flex bg-slate-50">
      
      {/* SIDEBAR */}
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
        
        <nav className="flex-1 space-y-3">
          {navLinks.map((link) => (
            <button 
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-colors ${location.pathname === link.path ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <span className="material-symbols-outlined">{link.icon}</span> {link.label}
            </button>
          ))}
        </nav>
        
        <div className="border-t border-slate-200 pt-6 space-y-3 relative">
           <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700">
            <span className="material-symbols-outlined">add</span> New Product
          </button>
          
          <NavLink icon="help_center" label="Help Center" />
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
            <IconButton icon="notifications" />
            <IconButton icon="settings" />
            
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
          {children}
        </main>
      </div>
    </div>
  );
};

// Helper Components
const NavLink = ({ icon, label }) => (
  <a href="#" className="flex items-center gap-3 p-3 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors">
    <span className="material-symbols-outlined">{icon}</span> {label}
  </a>
);

const IconButton = ({ icon }) => (
  <button className="text-slate-500 hover:text-indigo-600 p-2 rounded-lg hover:bg-slate-100 transition-colors">
    <span className="material-symbols-outlined text-2xl">{icon}</span>
  </button>
);

export default Layout;