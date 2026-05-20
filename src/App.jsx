import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
 feat/rights-audit-logs
import { AuthProvider } from './context/AuthContext';
import { UserRightsProvider } from './context/UserRightsContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AuditLogs from './pages/AuditLogs'; // Successfully imported the newly created audit module page
import AdminRoute from './components/AdminRoute';

// Temporary fallback shell components (Swap with separate dedicated view files upon production release)
const UserManagement = () => <div className="pl-64 p-8"><h2 className="text-xl font-semibold text-slate-800">User Management (Admin Core Only)</h2></div>;
const Settings = () => <div className="pl-64 p-8"><h2 className="text-xl font-semibold text-slate-800">System Settings (Admin Core Only)</h2></div>;

 fix/ui-polish
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
 
import { AuthProvider } from './context/AuthContext';
import { UserRightsProvider } from './context/UserRightsContext';
  dev
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
 fix/ui-polish
import AuthCallback from './pages/AuthCallback';
import Layout from './components/Layout';
import ProductListPage from './pages/ProductListPage';
import DeletedItemsPage from './pages/DeletedItemsPage';
import ProductReportPage from './pages/ProductReportPage';
import TopSellingPage from './pages/TopSellingPage';
import AdminManagementPage from './pages/AdminManagementPage';
import UserManagementPage from './pages/UserManagementPage'; 


 dev
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

  // PR-04: Nalinis na mula sa "SUPERADMINwa" typo para sa maayos na alignment rules
  const userRole = 'SUPERADMIN';

  // 2.2 Rights Matrix Alignment Setup
  // Awtomatikong magiging '1' (YES) ang PRD_ADD at PRD_EDIT para sa USER, ADMIN, at SUPERADMIN
  // Ang PRD_DEL naman ay magiging '1' (YES) LAMANG kung ang account ay SUPERADMIN
  const permissions = {
    PRD_ADD: userRole === 'USER' || userRole === 'ADMIN' || userRole === 'SUPERADMIN' ? 1 : 0,
    PRD_EDIT: userRole === 'USER' || userRole === 'ADMIN' || userRole === 'SUPERADMIN' ? 1 : 0,
    PRD_DEL: userRole === 'SUPERADMIN' ? 1 : 0,
  };

  // Iwasan ang white screen habang chinecheck ang session o database stream
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
 dev

  return (
    <Router>
      <AuthProvider>
        <UserRightsProvider>
          <Routes>
 feat/rights-audit-logs
            {/* 🌐 Public Route: Authentication Terminal Gateway */}
            <Route path="/login" element={<Login />} />

            {/* 📊 General Protected Route: Shared Authenticated Workspace */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 🔒 HIGH-PRIVILEGE ADMINISTRATIVE MODULE ENTRIES (GATED BY HOC SECURITY STRATEGY) */}
            <Route 
              path="/users" 
              element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <AdminRoute>
                  <Settings />
                </AdminRoute>
              } 
            />
            <Route 
              path="/audit-logs" 
              element={
                <AdminRoute>
                  <AuditLogs />
                </AdminRoute>
              } 
            />

            {/* 🔄 Fallback Redirection Wildcard */}

            {/* 🌐 Public Route: Authentication Gateway */}
            <Route path="/login" element={<Login />} />

 fix/ui-polish
        {/* Dashboard Route na nakabalot sa Layout */}
        <Route 
          path="/dashboard" 
          element={
            <Layout userRole={userRole}>
              <Dashboard />
            </Layout>
          } 
        />
        
        {/* PRODUCTS ROUTE WITH DYNAMIC PERMISSIONS */}
        <Route
          path="/products"
          element={
            <Layout userRole={userRole}>
              {/* IPINASA ANG DYNAMIC PERMISSIONS AT USERROLE PROPS */}
              <ProductListPage userRole={userRole} permissions={permissions} />
            </Layout>
          }
        />

        {/* SPRINT 3 / M2: PRODUCT REPORT ROUTE GUARD (REP_001) */}
        <Route 
          path="/product-report" 
          element={
            <Layout userRole={userRole}>
              {userRole === 'ADMIN' || userRole === 'SUPERADMIN' ? (
                <ProductReportPage />
              ) : (
                <Navigate to="/products" replace />
              )}
            </Layout>
          } 
        />

        {/* SPRINT 3 / M2: TOP SELLING ROUTE GUARD (REP_002) - Exclusive for SUPERADMIN */}
        <Route 
          path="/top-selling" 
          element={
            <Layout userRole={userRole}>
              {userRole === 'SUPERADMIN' ? (
                <TopSellingPage />
              ) : (
                <Navigate to="/products" replace />
              )}
            </Layout>
          } 
        />

        {/* DELETED ITEMS ROUTE GUARD */}
        <Route 
          path="/deleted-items" 
          element={
            <Layout userRole={userRole}>
              {userRole === 'ADMIN' || userRole === 'SUPERADMIN' ? (
                <DeletedItemsPage userRole={userRole} />
              ) : (
                <Navigate to="/products" replace />
              )}
            </Layout>
          } 
        />

        {/* SPRINT 3 / M2: USER MANAGEMENT ROUTE GUARD (PR-02) */}
        <Route 
          path="/admin" 
          element={
            <Layout userRole={userRole}>
              {userRole === 'ADMIN' || userRole === 'SUPERADMIN' ? (
                <AdminManagementPage />
              ) : (
                <Navigate to="/products" replace />
              )}
            </Layout>
          } 
        />
        
        <Route 
          path="/admin/users" 
          element={
            <UserManagementPage />
            } 
          />

            {/* 📊 Main Application Route: Protected Workspace */}
            <Route path="/dashboard" element={<Dashboard />} />
 dev

            {/* 🔄 Fallback Redirection: Route unrecognized URLs back to the login terminal */}
 dev
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </UserRightsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
