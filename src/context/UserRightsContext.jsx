import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { useAuth } from './AuthContext'; // Para makuha yung current user ID

const UserRightsContext = createContext();

export const UserRightsProvider = ({ children }) => {
  const { user } = useAuth(); 
  const [rights, setRights] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRights = async () => {
      if (user?.id) {
        // Requirement: Queries UserModule_Rights for currentUser.userId
        const { data, error } = await supabase
          .from('UserModule_Rights')
          .select('*')
          .eq('userId', user.id)
          .single();

        if (!error && data) {
          setRights(data);
        }
      }
      setLoading(false);
    };

    fetchRights();
  }, [user]);

  // Requirement: Centralized gating logic
  const value = {
    rights,
    loading,
    // Helper para hindi na tayo mag-check ng === 1 sa components
    canAdd: rights.PRD_ADD === 1,
    canEdit: rights.PRD_EDIT === 1,
    canDelete: rights.PRD_DEL === 1,
    // Requirement: Stamp column & Sidebar gating
    isAdmin: user?.user_type === 'ADMIN' || user?.user_type === 'SUPERADMIN'
  };

  return (
    <UserRightsContext.Provider value={value}>
      {children}
    </UserRightsContext.Provider>
  );
};

// Requirement: useRights() hook
export const useRights = () => {
  const context = useContext(UserRightsContext);
  if (!context) {
    throw new Error('useRights must be used within a UserRightsProvider');
  }
  return context;
};