import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const UserRightsContext = createContext();

export const UserRightsProvider = ({ children }) => {
  const { user } = useAuth();
  const [rights, setRights] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRights = async () => {
      if (user) {
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
      }
      setLoading(false);
    };
    fetchRights();
  }, [user]);

  return (
    <UserRightsContext.Provider value={{ rights, loading }}>
      {children}
    </UserRightsContext.Provider>
  );
};

export const useRights = () => useContext(UserRightsContext);

// PR-01 FINAL VERSION - ACTUAL CODE CONTENT