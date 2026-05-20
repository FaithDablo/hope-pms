import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ProductModal from '../components/modals/ProductModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import PriceHistoryPanel from '../components/modals/PriceHistoryPanel';

const ProductListPage = ({ 
  userRole = 'SUPERADMIN', 
  permissions = { PRD_ADD: 1, PRD_EDIT: 1, PRD_DEL: 1 }, 
  searchQuery = '' 
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Active'); 
  const [expandedRow, setExpandedRow] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // 1. Diretsong hilahin ang mga produkto mula sa product table
      const { data: productData, error: productError } = await supabase
        .from('product')
        .select('prodcode, description, unit');

      if (productError) throw productError;

      // 2. Diretsong hilahin ang buong kasaysayan ng presyo mula sa pricehist table
      const { data: priceData, error: priceError } = await supabase
        .from('pricehist')
        .select('prodcode, effdate, unitprice');

      if (priceError) throw priceError;

      const safeProducts = productData || [];
      const safePrices = priceData || [];

      // 3. Pagsamahin ang dalawang arrays gamit ang safe, conditional fallbacks para maiwasan ang JSON.parse crash
      const formattedData = safeProducts.map(item => {
        if (!item || !item.prodcode) return null;

        // Hanapin ang lahat ng presyo na kapareho ng prodcode ng produkto
        const itemHistory = safePrices.filter(p => p && String(p.prodcode).trim() === String(item.prodcode).trim());
        
        let finalPrice = 0;
        if (itemHistory.length > 0) {
          // I-sort ang presyo mula sa pinakabago pababa base sa effdate
          const sortedHistory = [...itemHistory].sort((a, b) => new Date(b.effdate) - new Date(a.effdate));
          if (sortedHistory[0] && sortedHistory[0].unitprice) {
            finalPrice = sortedHistory[0].unitprice;
          }
        }
        
        return {
          id: item.prodcode,
          prodCode: item.prodcode,
          description: item.description || 'No Description Available',
          unit: item.unit ? String(item.unit).toUpperCase() : 'EA', 
          price: finalPrice,
          status: 'Active', 
          stamp: 'SYSTEM LOG'
        };
      }).filter(Boolean); // Tanggalin ang anumang null rows na nakasira sa compiler kanina

      setProducts(formattedData);
    } catch (error) {
      console.error('Fetch Error Logged:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const confirmSoftDelete = async () => {
    if (!productToDelete) return;
    setProducts(prev => prev.map(p => 
      p.prodCode === productToDelete.prodCode ? { ...p, status: 'Inactive' } : p
    ));
    setIsDeleteModalOpen(false);
  };

  const filteredProducts = products.filter(p => {
    if (!p || !p.prodCode) return false;
    const currentStatusNormalized = p.status ? p.status.toLowerCase() : 'active';
    
    if (!isAdmin && currentStatusNormalized !== 'active') return false; 
    
    if (isAdmin) {
      if (activeTab === 'Active' && currentStatusNormalized !== 'active') return false;
      if (activeTab === 'Out of Stock' && currentStatusNormalized !== 'inactive') return false;
    }

    const cleanQuery = searchQuery.toLowerCase().trim();
    if (cleanQuery === '') return true;

    return (
      p.prodCode.toLowerCase().includes(cleanQuery) || 
      p.description.toLowerCase().includes(cleanQuery)
    );
  });

  let baseColumnsCount = 5; 
  if (isAdmin) baseColumnsCount += 1; 

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <div className="text-sm font-semibold text-indigo-600 italic animate-pulse">Parsing application matrix logs...</div>
      </div>
    );
  }

  return (
    <div className="font-['Inter']">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Products List</h1>
          <p className="text-xs text-slate-400 mt-1.5">Manage enterprise directory data, item tracking identifiers, and costing parameters.</p>
        </div>
        
        {permissions.PRD_ADD === 1 && (
          <button 
            onClick={() => { setModalMode('add'); setSelectedProduct(null); setIsModalOpen(true); }}
            className="px-5 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add_box</span> New Product
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isAdmin && (
          <div className="flex gap-8 px-8 pt-6 bg-slate-50/50 border-b border-slate-200">
            {['All Products', 'Active', 'Out of Stock'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setExpandedRow(null); }}
                className={`pb-4 text-xs uppercase tracking-wider font-bold relative transition-all ${
                  activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-indigo-600 rounded-t-full" />}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-8 py-4">Product Code</th>
                <th className="px-8 py-4">Description</th>
                <th className="px-8 py-4">Unit</th>
                <th className="px-8 py-4">Current Price</th>
                {isAdmin && <th className="px-8 py-4 text-center">Stamp</th>}
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <React.Fragment key={p.id}>
                  <tr 
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === p.id ? null : p.id)}
                  >
                    <td className="px-8 py-4 text-sm font-bold text-indigo-600">
                      <span className="material-symbols-outlined text-xs align-middle mr-2 select-none">
                        {expandedRow === p.id ? 'expand_less' : 'expand_more'}
                      </span>
                      {p.prodCode}
                    </td>
                    <td className="px-8 py-4 text-sm font-semibold text-slate-800">{p.description}</td>
                    <td className="px-8 py-4 text-xs font-bold text-slate-500">
                      <span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200/60">{p.unit}</span>
                    </td>
                    <td className="px-8 py-4 text-sm font-bold text-slate-900 text-center"> {/* Dito nagdagdag ng text-center */}
                      ₱{parseFloat(p.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    
                    {isAdmin && (
                      <td className="px-8 py-4 text-center text-[10px] font-mono text-slate-400">
                        {p.stamp}
                      </td>
                    )}
                    
                    <td className="px-8 py-4 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                      {permissions.PRD_EDIT === 1 && (
                        <button 
                          onClick={() => { setSelectedProduct(p); setModalMode('edit'); setIsModalOpen(true); }} 
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-xl">edit_square</span>
                        </button>
                      )}
                      
                      {permissions.PRD_DEL === 1 && p.status.toLowerCase() === 'active' && (
                        <button 
                          onClick={() => { setProductToDelete(p); setIsDeleteModalOpen(true); }} 
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-xl">archive</span>
                        </button>
                      )}
                    </td>
                  </tr>
                  
                  {expandedRow === p.id && (
                    <tr className="bg-slate-50/40">
                      <td colSpan={baseColumnsCount} className="px-8 py-5 border-t border-b border-slate-100">
                        <PriceHistoryPanel prodCode={p.prodCode} userRole={userRole} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="p-16 text-center text-slate-400 italic text-sm font-medium bg-white">
              No inventory entries mapped inside the active table viewports.
            </div>
          )}
        </div>
      </div>

      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mode={modalMode} initialData={selectedProduct} onSuccess={fetchProducts} />
      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmSoftDelete} productName={productToDelete?.description} />
    </div>
  );
};

export default ProductListPage;