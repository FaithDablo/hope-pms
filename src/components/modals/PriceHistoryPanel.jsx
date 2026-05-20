import React, { useState, useEffect } from 'react';
import { supabase } from "../../lib/supabase";

const PriceHistoryPanel = ({ prodCode, userRole }) => {
  const [history, setHistory] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [effDate, setEffDate] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    if (!prodCode) return;
    setLoading(true);
    try {
      // SAFE QUERY: Diretsong pagkuha ng data na may catch block para maiwasan ang JSON.parse error
      const { data, error } = await supabase
        .from('pricehist')
        .select('effdate, unitprice')
        .eq('prodcode', prodCode);

      if (error) {
        console.error('Supabase query returned an error:', error.message);
        return;
      }

      // Safe mapping at pag-sort gamit ang purong JavaScript
      if (data && Array.isArray(data)) {
        const sorted = [...data].sort((a, b) => new Date(b.effdate) - new Date(a.effdate));
        setHistory(sorted);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error('Network or parsing crash caught successfully:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [prodCode]);

  const handleAddPrice = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('pricehist').insert([
        { 
          prodcode: prodCode, 
          unitprice: parseFloat(newPrice), 
          effdate: effDate
        }
      ]);

      if (!error) {
        setNewPrice('');
        setEffDate('');
        setShowAddForm(false);
        fetchHistory();
      } else {
        alert(error.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-50 p-4 rounded-lg mt-2 border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Price History</h4>
        {(userRole === 'ADMIN' || userRole === 'SUPERADMIN') && (
          <button 
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
          >
            {showAddForm ? 'Cancel' : 'Add New Price'}
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleAddPrice} className="mb-4 grid grid-cols-2 gap-2 bg-white p-3 rounded border border-indigo-100 shadow-sm">
          <input 
            type="date" 
            required 
            value={effDate}
            onChange={(e) => setEffDate(e.target.value)}
            className="text-xs p-2 border rounded" 
          />
          <input 
            type="number" 
            placeholder="Unit Price" 
            step="0.01"
            required 
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="text-xs p-2 border rounded" 
          />
          <button type="submit" className="col-span-2 bg-indigo-500 text-white text-xs py-2 rounded">Submit Price</button>
        </form>
      )}

      {loading ? (
        <div className="text-xs text-indigo-600 italic p-2">Loading logs...</div>
      ) : (
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-200">
              <th className="pb-2">Effective Date</th>
              <th className="pb-2">Unit Price</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, index) => (
              <tr key={index} className="border-b border-slate-100 last:border-0">
                <td className="py-2 text-slate-600">
                  {h.effdate ? new Date(h.effdate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </td>
                <td className="py-2 font-bold text-slate-800">
                  ₱{h.unitprice ? parseFloat(h.unitprice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan="2" className="py-4 text-center text-slate-400 italic">No price records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PriceHistoryPanel;