import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Sidebar from './components/Sidebar';
import { UserRightsProvider, useRights } from './context/UserRightsContext';

/**
 * Isolated Dashboard Component 
 * Decoupled to safely consume granular user authorization flags from UserRightsContext.
 */
const Dashboard = () => {
  const { canAdd, canEdit, canDelete, isAdmin, loading } = useRights();

  // Block UI assembly until user permission matrices are fully fetched from the database
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500 animate-pulse">Loading permissions...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Primary Left Navigation Panel */}
      <Sidebar />

      {/* Main Feature Content Canvas */}
      <main className="flex-1 pl-64 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Section Header */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Inventory Overview</h2>
              <p className="text-slate-500 text-sm mt-1">Manage stock allocations, product items, and hardware distributions.</p>
            </div>
            
            {/* PR-02: Action Button Feature-Gating Control */}
            {canAdd && (
              <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-95">
                <span className="material-symbols-outlined text-sm">add</span>
                Add New Product
              </button>
            )}
          </div>

          {/* Core Inventory Presentation Grid */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
                    <th className="p-4 pl-6">Product Name</th>
                    <th className="p-4">Status</th>
                    {/* PR-02: Structural Column Guard - Only accessible to authorized admin metrics */}
                    {isAdmin && <th className="p-4">Admin Stamp</th>}
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-600 divide-y divide-slate-50">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-medium text-slate-800">Sample Medical Kit</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-600">
                        In Stock
                      </span>
                    </td>
                    {/* PR-02: Row Data Conditional Authorization Render */}
                    {isAdmin && (
                      <td className="p-4 font-mono text-xs text-slate-400">
                        sys_admin_v2_2026
                      </td>
                    )}
                    <td className="p-4 pr-6 text-right space-x-2">
                      {/* PR-02: Interaction Element Modification Safeguards */}
                      {canEdit && (
                        <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all">
                          Edit
                        </button>
                      )}
                      {canDelete && (
                        <button className="px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-medium text-red-600 transition-all">
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <UserRightsProvider>
      <Router>
        <Routes>
          {/* Development Branch Router Configurations */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Default entry routing with embedded secure gating logic */}
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </UserRightsProvider>
  );
}

export default App;
