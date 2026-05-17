import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DeletedItemsPage = ({ userRole = 'USER' }) => {
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ADMIN at SUPERADMIN lang ang pwedeng pumasok dito (PR-04 Gating)
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';

  const fetchDeletedProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product')
        .select('*')
        .eq('record_status', 'INACTIVE'); 

      if (error) throw error;

      // I-sort ayon sa Product Code para organisado ang listahan
      setDeletedProducts((data || []).sort((a, b) => a.prodcode.localeCompare(b.prodcode)));
    } catch (err) {
      console.error('Fetch Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchDeletedProducts();
  }, [isAdmin]);

  // Security Check Guardrail: Harangan ang mga hindi authorized na sumasalamin sa URL
  if (!isAdmin) {
    return (
      <div className="p-20 text-center text-red-600 font-bold flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-6xl block mb-3 text-red-500 animate-pulse">gpp_bad</span>
        <h2 className="text-xl font-black">403 - Unauthorized Access</h2>
        <p className="text-sm text-slate-400 font-medium mt-1">Admin or Superadmin privilege is required to view this module.</p>
      </div>
    );
  }

  // RECOVER ACTION LOGIC
  const handleRecover = async (prodCode) => {
    const confirmRecover = window.confirm(`Are you sure you want to recover product ${prodCode}?`);
    if (!confirmRecover) return;

    try {
      const { error } = await supabase
        .from('product')
        .update({ record_status: 'ACTIVE' }) 
        .eq('prodcode', prodCode);

      if (error) throw error;

      alert(`Product ${prodCode} has been successfully restored to Active inventory!`);
      await fetchDeletedProducts(); // I-refresh ang talahanayan
    } catch (err) {
      console.error('Recovery Error:', err.message);
      alert('Failed to recover the product. Please try again.');
    }
  };

  if (loading) return <div className="p-20 text-center text-indigo-600 italic font-medium">Loading Deleted Items Directory...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-700">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Deleted Items Archive</h1>
          <p className="text-slate-400 text-sm mt-1">Management console for inactive enterprise suite products.</p>
        </div>
        <div className="px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-red-600 font-bold text-xs flex items-center gap-1.5 shadow-sm">
          <span className="material-symbols-outlined text-sm">shield_person</span> Authorized Admin View
        </div>
      </div>

      {/* RECOVER TABLE CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Product Code</th>
                <th className="px-8 py-5">Description</th>
                <th className="px-8 py-5 text-center">Stamp Log</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {deletedProducts.length > 0 ? (
                deletedProducts.map((p) => (
                  <tr key={p.prodcode} className="hover:bg-slate-50/50 transition-colors">
                    {/* PRODUCT CODE */}
                    <td className="px-8 py-5 font-bold text-red-500">{p.prodcode}</td>
                    
                    {/* DESCRIPTION */}
                    <td className="px-8 py-5 text-slate-700">{p.description || 'No Description Available'}</td>
                    
                    {/* STAMP */}
                    <td className="px-8 py-5 text-center text-xs font-mono text-slate-400">{p.stamp || 'NULL'}</td>
                    
                    {/* ACTION BUTTON */}
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleRecover(p.prodcode)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 font-bold text-xs shadow-sm border border-emerald-100/50 transition-all active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm font-bold">settings_backup_restore</span> 
                        Recover Product
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">
                    No record data found inside the archive directory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeletedItemsPage;