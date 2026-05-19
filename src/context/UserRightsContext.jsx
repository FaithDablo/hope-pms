import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

// 1. Create the Context to manage globally shared user permissions
const UserRightsContext = createContext();

export const UserRightsProvider = ({ children }) => {
  const { user } = useAuth(); // Retrieve the current authenticated user from AuthContext
  const [rights, setRights] = useState({}); // Stores the optimized map of permissions (e.g., { PRD_ADD: 1, PRD_EDIT: 0 })
  const [loading, setLoading] = useState(true); // Tracking state to prevent premature component rendering while fetching

  useEffect(() => {
    const fetchRights = async () => {
      if (user) {
        setLoading(true); // Begin loading sequence

        // Fetch user permissions mapping (module code and boolean/int status) from Supabase
        const { data, error } = await supabase
          .from('UserModule_Rights')
          .select('module_code, has_access')
          .eq('userId', user.id);

        if (!error && data) {
          // Transform array data into an Object Map for faster, O(1) lookup speeds in components
          const rightsMap = data.reduce((acc, curr) => {
            acc[curr.module_code] = curr.has_access;
            return acc;
          }, {});
          
          setRights(rightsMap); // Commit parsed map to local state
        }
      }
      setLoading(false); // Terminate loading sequence regardless of API outcome
    };

    fetchRights();
  }, [user]); // Hook re-triggers dynamically upon user login state changes

  // Expose clean boolean flags to simplify role and feature gating inside your page views
  const value = {
    rights,
    loading,
    canAdd: rights.PRD_ADD === 1,
    canEdit: rights.PRD_EDIT === 1,
    canDelete: rights.PRD_DEL === 1,
    // Automatically elevate system access if the user's role metadata is designated as an Admin or Superadmin
    isAdmin: user?.user_type === 'ADMIN' || user?.user_type === 'SUPERADMIN'
  };

  return (
    <UserRightsContext.Provider value={value}>
      {children}
    </UserRightsContext.Provider>
  );
};

// 2. Custom hook for consuming user rights securely within child components
export const useRights = () => {
  const context = useContext(UserRightsContext);
  
  // Guard clause to catch runtime configuration errors if a component attempts to consume this context outside its provider
  if (!context) {
    throw new Error('useRights must be used within a UserRightsProvider');
  }
  
  return context;
};
