import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const RightsContext = createContext();

export const UserRightsProvider = ({ children }) => {
  const { user } = useAuth();
  const [rights, setRights] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRights = async () => {
      if (user) {
        setLoading(true);
        // Kukuha ng rights base sa userId
        const { data, error } = await supabase
          .from('UserModule_Rights')
          .select('module_code, has_access')
          .eq('userId', user.id);

        if (data) {
          // I-oorganize ang data: { PRD_ADD: 1, PRD_EDIT: 0 }
          const rightsMap = data.reduce((acc, item) => {
            acc[item.module_code] = item.has_access;
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
    <RightsContext.Provider value={{ rights, loading }}>
      {children}
    </RightsContext.Provider>
  );
};

export const useRights = () => useContext(RightsContext);