import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 scale-in-center">
        <div className="flex flex-col items-center text-center">
          {/* Warning Icon */}
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-red-500 text-4xl">warning</span>
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Archive</h3>
          <p className="text-slate-500 text-sm mb-6">
            Are you sure you want to archive <span className="font-bold text-slate-700">"{productName}"</span>? 
            This will hide the item from the active product list.
          </p>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors border border-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 bg-red-500 text-white font-medium hover:bg-red-600 rounded-xl transition-all shadow-md shadow-red-200"
            >
              Archive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;