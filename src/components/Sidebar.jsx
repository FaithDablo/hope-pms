import React from 'react';
import { useRights } from '../context/UserRightsContext';

const ProductActions = () => {
  const { canAdd, canEdit, canDelete } = useRights();

  return (
    <div className="flex gap-2">
      {canAdd && (
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
          Add Product
        </button>
      )}
      
      <button 
        disabled={!canEdit} 
        className="disabled:opacity-50 disabled:cursor-not-allowed bg-slate-100 text-slate-700 px-4 py-2 rounded-lg"
      >
        Edit Details
      </button>
    </div>
  );
};
