import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';
import Layout from './components/Layout';
import ProductListPage from './pages/ProductListPage';
import DeletedItemsPage from './pages/DeletedItemsPage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kunin ang initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Makinig sa auth changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // PR-04: Kunin ang userRole mula sa metadata para sa rights validation at route guarding
  const userRole = user?.user_metadata?.role || 'USER';

  // 2.2 Rights Matrix Alignment Setup
  // Awtomatikong magiging '1' (YES) ang PRD_ADD at PRD_EDIT para sa USER, ADMIN, at SUPERADMIN
  // Ang PRD_DEL naman ay magiging '1' (YES) LAMANG kung ang account ay SUPERADMIN
  const permissions = {
    PRD_ADD: userRole === 'USER' || userRole === 'ADMIN' || userRole === 'SUPERADMIN' ? 1 : 0,
    PRD_EDIT: userRole === 'USER' || userRole === 'ADMIN' || userRole === 'SUPERADMIN' ? 1 : 0,
    PRD_DEL: userRole === 'SUPERADMIN' ? 1 : 0,
  };

  // Iwasan ang white screen habang chinecheck ang session
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Pag open ng site, rekta sa Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Dashboard Route na nakabalot sa Layout */}
        <Route 
          path="/dashboard" 
          element={
            <Layout>
              <Dashboard />
            </Layout>
          } 
        />
        
        {/* PRODUCTS ROUTE WITH DYNAMIC PERMISSIONS */}
        <Route
          path="/products"
          element={
            <Layout>
              {/* IPINASA ANG DYNAMIC PERMISSIONS AT USERROLE PROPS */}
              <ProductListPage userRole={userRole} permissions={permissions} />
            </Layout>
          }
        />

        {/* DELETED ITEMS ROUTE GUARD */}
        <Route 
          path="/deleted-items" 
          element={
            <Layout>
              {userRole === 'ADMIN' || userRole === 'SUPERADMIN' ? (
                <DeletedItemsPage userRole={userRole} />
              ) : (
                <Navigate to="/products" replace />
              )}
            </Layout>
          } 
        />

        {/* Fallback: Kapag maling URL ang tinype, babalik sa login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;