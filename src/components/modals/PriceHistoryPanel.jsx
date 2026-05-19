import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const PriceHistoryPanel = ({ prodCode, userRole }) => {
  const [history, setHistory] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [effDate, setEffDate] = useState('');

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('pricehist')
      .select('effdate, unitprice')
      .eq('prodcode', prodCode)
      .order('effdate', { ascending: false });

    if (!error) setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
  }, [prodCode]);

  const handleAddPrice = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('pricehist').insert([
      { 
        prodcode: prodCode, 
        unitprice: parseFloat(newPrice), 
        effdate: effDate,
        record_status: 'ACTIVE' 
      }
    ]);

    if (!error) {
      setNewPrice('');
      setEffDate('');
      setShowAddForm(false);
      fetchHistory();
    }
  };

  return (
    <div className="bg-slate-50 p-4 rounded-lg mt-2 border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Price History</h4>
        {(userRole === 'ADMIN' || userRole === 'SUPERADMIN') && (
          <button 
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
            required 
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="text-xs p-2 border rounded" 
          />
          <button type="submit" className="col-span-2 bg-indigo-500 text-white text-xs py-2 rounded">Submit Price</button>
        </form>
      )}

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
              <td className="py-2 text-slate-600">{h.effdate}</td>
              <td className="py-2 font-bold text-slate-800">₱{h.unitprice.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceHistoryPanel;