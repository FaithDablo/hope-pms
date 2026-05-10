import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { useAuth } from './AuthContext'; 

const UserRightsContext = createContext();

export const UserRightsProvider = ({ children }) => {
  const { user } = useAuth(); // Kukuha ng currentUser.id at user_type
  const [rights, setRights] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRights = async () => {
      if (user) {
        // Query sa UserModule_Rights table
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

  // Centralized Gating Logic (Para walang copy-paste sa components)
  const canAdd = rights.PRD_ADD === 1;
  const canEdit = rights.PRD_EDIT === 1;
  const canDelete = rights.PRD_DEL === 1;
  
  // Stamp & Sidebar gating: Only for ADMIN or SUPERADMIN
  const isPrivileged = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

  return (
    <UserRightsContext.Provider value={{ rights, canAdd, canEdit, canDelete, isPrivileged, loading }}>
      {children}
    </UserRightsContext.Provider>
  );
};

export const useRights = () => useContext(UserRightsContext);