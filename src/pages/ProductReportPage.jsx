import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ProductReportPage({ searchQuery }) {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const fetchCurrentPrices = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('current_product_price').select('*');
        if (error) throw error;
        setPrices(data || []);
      } catch (err) {
        setErrorMsg('Failed to sync current product market catalogs.');
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentPrices();
  }, []);

  const filteredPrices = prices.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (item.prodcode || '').toLowerCase().includes(query) ||
      (item.description || '').toLowerCase().includes(query) ||
      (item.unit || '').toLowerCase().includes(query)
    );
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedPrices = [...filteredPrices].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aValue = a[sortConfig.key] ?? '';
    let bValue = b[sortConfig.key] ?? '';
    if (sortConfig.key === 'unitprice') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    } else {
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }
    return sortConfig.direction === 'asc' ? (aValue < bValue ? -1 : 1) : (aValue > bValue ? -1 : 1);
  });

  const handleExportCSV = () => {
    const headers = ['Product Code', 'Description', 'Unit', 'Active Market Price'];
    const csvRows = [headers.join(','), ...sortedPrices.map(i => [`"${i.prodcode}"`, `"${i.description.replace(/"/g, '""')}"`, `"${i.unit || ''}"`, i.unitprice].join(','))];
    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Price_Report_${new Date().toISOString().slice(0,10)}.csv`);
    link.click();
  };

  return (
    <div className="font-['Inter']">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Current Price Matrix</h1>
          <p className="text-slate-500 text-sm">Active product line tracking dashboard (REP_001).</p>
        </div>
        <button onClick={handleExportCSV} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined">download</span> Export CSV
        </button>
      </div>

      {loading ? <div className="text-center py-20 italic text-emerald-600">Loading catalog...</div> : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#0b1c30] text-white text-[11px] uppercase">
              <tr>
                <th onClick={() => handleSort('prodcode')} className="py-4 px-6 cursor-pointer hover:bg-slate-800">PRODCODE {sortConfig.key === 'prodcode' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</th>
                <th onClick={() => handleSort('description')} className="py-4 px-6 cursor-pointer hover:bg-slate-800">DESCRIPTION {sortConfig.key === 'description' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</th>
                <th onClick={() => handleSort('unit')} className="py-4 px-6 cursor-pointer hover:bg-slate-800">UNIT {sortConfig.key === 'unit' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</th>
                {/* Center aligned header para sa Price */}
                <th onClick={() => handleSort('unitprice')} className="py-4 px-6 cursor-pointer hover:bg-slate-800 text-center">UNITPRICE {sortConfig.key === 'unitprice' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedPrices.map(item => (
                <tr key={item.prodcode} className="hover:bg-slate-50">
                  <td className="py-4 px-6 text-sm font-bold text-indigo-600 font-mono">{item.prodcode}</td>
                  <td className="py-4 px-6 text-sm text-slate-800">{item.description}</td>
                  <td className="py-4 px-6 text-xs text-slate-500 uppercase">{item.unit || 'EA'}</td>
                  {/* Center aligned data cell para sa Price */}
                  <td className="py-4 px-6 text-sm font-black text-emerald-600 text-center">
                    ₱{parseFloat(item.unitprice || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}