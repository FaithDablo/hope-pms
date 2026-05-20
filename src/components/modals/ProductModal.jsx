import React, { useState, useEffect } from 'react';
import { supabase } from "../../lib/supabase";

const ProductModal = ({ isOpen, onClose, mode = 'add', initialData = null, onSuccess }) => {
  const [prodCode, setProdCode] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('ea'); // Default sa 'ea' (lowercase) para sa check constraint
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setProdCode(initialData.prodCode || initialData.prodcode || '');
      setDescription(initialData.description || '');
      setUnit(initialData.unit ? initialData.unit.trim().toLowerCase() : 'ea');
      setPrice(initialData.price || '');
    } else {
      setProdCode('');
      setDescription('');
      setUnit('ea'); // Default value
      setPrice('');
    }
  }, [mode, initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Siguraduhing lowercase ang unit bago i-save para iwas 'unit_ck' constraint error
      const cleanUnit = unit.trim().toLowerCase();

      if (mode === 'add') {
        // LUNAS: Tinanggal ang 'record_status' column dahil wala ito sa inyong table structure
        const { error: prodError } = await supabase
          .from('product')
          .insert([{ 
            prodcode: prodCode.trim(), 
            description: description.trim(), 
            unit: cleanUnit
          }]);

        if (prodError) throw prodError;

        // Mag-insert ng initial price sa 'pricehist' table kung may nilagay na presyo
        if (price && parseFloat(price) > 0) {
          const { error: priceError } = await supabase
            .from('pricehist')
            .insert([{
              prodcode: prodCode.trim(),
              effdate: new Date().toISOString().split('T')[0], // Kasalukuyang petsa (YYYY-MM-DD)
              unitprice: parseFloat(price)
            }]);

          if (priceError) throw priceError;
        }

      } else {
        // Mode is 'edit'
        const { error: updateError } = await supabase
          .from('product')
          .update({ 
            description: description.trim(), 
            unit: cleanUnit 
          })
          .eq('prodcode', prodCode);

        if (updateError) throw updateError;
      }

      alert(`Product successfully ${mode === 'add' ? 'created' : 'updated'}!`);
      onSuccess(); // I-refresh ang listahan sa ProductListPage
      onClose();   // Isara ang modal
    } catch (error) {
      console.error(error);
      alert(error.message || "An error occurred while saving the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-100">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">
            {mode === 'add' ? 'Add New Product' : 'Edit Product'}
          </h3>
          <button onClick={onClose} type="button" className="text-slate-400 hover:text-slate-600 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* MODAL FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* PRODUCT CODE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Product Code</label>
            <input 
              type="text" 
              required
              disabled={mode === 'edit'} // Primary Key locking control
              value={prodCode}
              onChange={(e) => setProdCode(e.target.value)}
              placeholder="e.g., AD0005"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 font-medium"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
            <textarea 
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter item description..."
              rows="3"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* UNIT DROPDOWN */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 font-semibold"
              >
                <option value="ea">ea (Each)</option>
                <option value="pc">pc (Piece)</option>
              </select>
            </div>

            {/* INITIAL PRICE */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Price (₱)</label>
              <input 
                type="number" 
                step="0.01"
                required={mode === 'add'} 
                disabled={mode === 'edit'} 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 font-bold"
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-all disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Saving...' : mode === 'add' ? 'Create Product' : 'Update Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProductModal;