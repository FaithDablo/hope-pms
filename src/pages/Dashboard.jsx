import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatus = async () => {
      // 1. Kunin ang current user session
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        navigate('/login');
        return;
      }

      // 2. I-verify ang status sa 'user' table base sa iyong DB
      const { data: userData, error: dbError } = await supabase
        .from('user')
        .select('record_status')
        .eq('id', user.id)
        .single();

      // 3. Kung INACTIVE, i-sign out at sipain pabalik sa login
      if (userData?.record_status === 'INACTIVE') {
        await supabase.auth.signOut();
        // Nagpapasa tayo ng state para alam ng Login page kung bakit siya pinalabas
        navigate('/login', { state: { message: "Access Denied: Your account is INACTIVE." } });
      }
    };

    checkUserStatus();
  }, [navigate]);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500 flex items-center gap-2">
        Dashboard <span className="material-symbols-outlined text-xs">chevron_right</span> <span className="text-indigo-600">Inventory</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-3xl text-indigo-950">Products</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 font-medium text-slate-700 hover:border-slate-300">
            <span className="material-symbols-outlined">export_notes</span> Export
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700">
            <span className="material-symbols-outlined">add</span> New Product
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="TOTAL SKU" value="2,543" change="+12%" icon="inventory" />
        <StatCard title="LOW STOCK ITEMS" value="18" icon="warning" action="Action Required" />
        <StatCard title="INCOMING SHIPMENTS" value="42" icon="local_shipping" action="Live" />
        <StatCard title="INVENTORY VALUE" value="$1.2M" icon="account_balance_wallet" change="MTD" />
      </div>

      {/* Table Section Placeholder */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Tab label="All Products" active />
          <Tab label="Active" />
          <Tab label="Out of Stock" />
        </div>
        
        {/* Table Content Placeholder (CRUD ready) */}
        <p className="text-slate-500">No products found.</p>
      </div>
    </div>
  );
};

// Helper Components (Manatiling pareho ang design mo)
const StatCard = ({ title, value, change, icon, action }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between gap-4">
    <div className="flex flex-col gap-1">
      <p className="text-xs text-slate-500 tracking-wider uppercase">{title}</p>
      <p className="font-bold text-3xl text-indigo-950">{value}</p>
    </div>
    <div className="flex flex-col items-end gap-3 text-right">
      <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      {change && <span className={`font-medium text-sm ${change === 'MTD' ? 'text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full' : 'text-green-600 bg-green-50 px-3 py-1 rounded-full'}`}>{change}</span>}
      {action && <span className={`font-medium text-sm ${action === 'Live' ? 'text-green-600 bg-green-50 px-3 py-1 rounded-full' : 'text-orange-600 bg-orange-50 px-3 py-1 rounded-full'}`}>{action}</span>}
    </div>
  </div>
);

const Tab = ({ label, active }) => (
  <button className={`px-4 py-2 font-medium rounded-lg ${active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}>
    {label}
  </button>
);

export default Dashboard;