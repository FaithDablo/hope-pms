import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ProductModal from '../components/modals/ProductModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import PriceHistoryPanel from '../components/modals/PriceHistoryPanel';

const ProductListPage = ({ userRole = 'USER', permissions = { PRD_ADD: 0, PRD_EDIT: 0, PRD_DEL: 0 }, searchQuery = '' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Active'); 
  const [expandedRow, setExpandedRow] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Gating status criteria base sa matrix at PR requirements
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product')
        .select(`*, pricehist (*)`);

      if (error) throw error;

      const formattedData = data.map(item => {
        const history = item.pricehist || [];
        const latestPrice = [...history].sort((a, b) => new Date(b.effdate) - new Date(a.effdate))[0];
        
        return {
          id: item.prodcode,
          prodCode: item.prodcode,
          description: item.description || 'No Description',
          unit: item.unit ? item.unit.toUpperCase() : 'EA', // Naka-uppercase para sa display base sa sample UI
          price: latestPrice ? latestPrice.unitprice : 0,
          status: item.record_status ? item.record_status.trim().toUpperCase() : 'ACTIVE',
          stamp: item.stamp
        };
      });

      setProducts(formattedData.sort((a, b) => a.prodCode.localeCompare(b.prodCode)));
    } catch (error) {
      console.error('Fetch Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const confirmSoftDelete = async () => {
    if (!productToDelete) return;
    const { error } = await supabase
      .from('product')
      .update({ record_status: 'INACTIVE' })
      .eq('prodcode', productToDelete.prodCode);

    if (!error) {
      await fetchProducts();
      setIsDeleteModalOpen(false);
    }
  };

  // Search Engine & Status Gating Filter
  const filteredProducts = products.filter(p => {
    // PR-01 Rule: Ang INACTIVE rows ay para sa ADMIN/SUPERADMIN lamang
    if (!isAdmin && p.status !== 'ACTIVE') return false; 
    if (isAdmin && activeTab === 'Active' && p.status !== 'ACTIVE') return false;
    if (isAdmin && activeTab === 'Out of Stock' && p.status !== 'INACTIVE') return false;

    // Real-time Search Input validation
    const cleanQuery = searchQuery.toLowerCase().trim();
    if (cleanQuery === '') return true;

    return (
      p.prodCode.toLowerCase().includes(cleanQuery) || 
      p.description.toLowerCase().includes(cleanQuery)
    );
  });

  // Dynamic colSpan calculator para sa Price History Panel expansion row
  // Dahil laging andiyan ang Actions column, nagsisimula tayo sa 5 base columns (Code, Desc, Unit, Price, Actions)
  let baseColumnsCount = 5; 
  if (isAdmin) baseColumnsCount += 1; // +1 para sa Stamp column ng Admin

  if (loading) return <div className="p-20 text-center text-indigo-600 italic">Loading ProManage...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Products List</h1>
        
        {/* PR-02: New Product visible sa lahat (USER/ADMIN/SUPERADMIN) dahil PRD_ADD = 1 */}
        {permissions.PRD_ADD === 1 && (
          <button 
            onClick={() => { setModalMode('add'); setSelectedProduct(null); setIsModalOpen(true); }}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-lg transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">add_box</span> New Product
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Admin Tabs view toggle */}
        {isAdmin && (
          <div className="flex gap-8 px-8 pt-6 border-b border-slate-100">
            {['All Products', 'Active', 'Out of Stock'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setExpandedRow(null); }}
                className={`pb-4 text-sm font-semibold relative transition-colors ${
                  activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full" />}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-8 py-5">Product Code</th>
                <th className="px-8 py-5">Description</th>
                <th className="px-8 py-5">Unit</th>
                <th className="px-8 py-5">Current Price</th>
                {/* PR-01: Stamp Column para sa ADMIN/SUPERADMIN lang */}
                {isAdmin && <th className="px-8 py-5 text-center">Stamp</th>}
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <React.Fragment key={p.id}>
                  <tr 
                    className={`hover:bg-indigo-50/30 transition-colors cursor-pointer ${p.status === 'INACTIVE' ? 'bg-slate-50 opacity-60' : ''}`}
                    onClick={() => setExpandedRow(expandedRow === p.id ? null : p.id)}
                  >
                    <td className="px-8 py-5 font-bold text-indigo-600">
                      <span className="material-symbols-outlined text-xs align-middle mr-2">
                        {expandedRow === p.id ? 'expand_less' : 'expand_more'}
                      </span>
                      {p.prodCode}
                    </td>
                    <td className="px-8 py-5 font-medium text-slate-700">{p.description}</td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-500">{p.unit}</td>
                    <td className="px-8 py-5 font-bold text-slate-900">₱{parseFloat(p.price).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                    
                    {/* PR-01: Stamp field data values */}
                    {isAdmin && <td className="px-8 py-5 text-center text-[10px] font-mono text-slate-400">{p.stamp || 'NULL'}</td>}
                    
                    {/* LAGING PRESENT ANG ACTIONS CELL PERO DYNAMIC ANG ICONS BASE SA MATRIX */}
                    <td className="px-8 py-5 text-right space-x-2">
                      {/* PR-02: Edit Form button — Lumalabas sa USER/ADMIN/SUPERADMIN (`PRD_EDIT = YES`) */}
                      {permissions.PRD_EDIT === 1 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); setModalMode('edit'); setIsModalOpen(true); }} 
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">edit_square</span>
                        </button>
                      )}
                      
                      {/* PR-02: Soft Delete button — Lalabas LANG sa SUPERADMIN (`PRD_DEL = YES` habang sa USER/ADMIN ay `NO`) */}
                      {permissions.PRD_DEL === 1 && p.status === 'ACTIVE' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setProductToDelete(p); setIsDeleteModalOpen(true); }} 
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">archive</span>
                        </button>
                      )}
                    </td>
                  </tr>
                  
                  {/* PR-03: Expansion wrapper block para sa Price History row rendering */}
                  {expandedRow === p.id && (
                    <tr>
                      <td colSpan={baseColumnsCount} className="px-8 py-4 bg-slate-50/50">
                        <PriceHistoryPanel prodCode={p.prodCode} userRole={userRole} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="p-16 text-center text-slate-400 italic font-medium bg-white">
              No products match your search keywords.
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