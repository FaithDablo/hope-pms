import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Siguraduhing tugma sa inyong lib path (pwedeng '../lib/supabase' o '../supabaseClient')
import { useAuth } from './AuthContext';

const UserRightsContext = createContext();

export const UserRightsProvider = ({ children }) => {
  const { user } = useAuth();
  const [rights, setRights] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRights = async () => {
      if (user?.id) {
        setLoading(true);
        const { data, error } = await supabase
          .from('UserModule_Rights')
          .select('module_code, has_access')
          .eq('userId', user.id);

        if (!error && data) {
          const rightsMap = data.reduce((acc, curr) => {
            acc[curr.module_code] = curr.has_access;
            return acc;
          }, {});
          setRights(rightsMap);
        }
      } else {
        setRights({});
      }
      setLoading(false);
    };

    fetchRights();
  }, [user]);

  // Centralized Gating Logic na kailangan natin para sa Dashboard at SuperAdmin checks
  const value = {
    rights,
    loading,
    canAdd: rights.PRD_ADD === 1,
    canEdit: rights.PRD_EDIT === 1,
    canDelete: rights.PRD_DEL === 1,
    isAdmin: user?.user_type === 'ADMIN' || user?.user_type === 'SUPERADMIN'
  };

  return (
    <UserRightsContext.Provider value={value}>
      {children}
    </UserRightsContext.Provider>
  );
};

export const useRights = () => {
  const context = useContext(UserRightsContext);
  if (!context) {
    throw new Error('useRights must be used within a UserRightsProvider');
  }
  return context;
};