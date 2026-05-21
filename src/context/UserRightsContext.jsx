// M1 Dablo, Faith —- PR-01: feat/sprint2-security // UserRightsContext.jsx - Global auth state broker.
// Streams active role permissions context (SUPERADMIN, ADMIN, USER) dynamically across the DOM viewport.
// Manages authentication event loops and hooks into state claims securely.

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; 
import { useAuth } from './AuthContext';

// 1. Initialize the shared React Context for Role and Feature-Based Access Control
const UserRightsContext = createContext();

export const UserRightsProvider = ({ children }) => {
  const { user } = useAuth(); // Retrieve active authentication metadata from AuthContext
  const [rights, setRights] = useState({}); // Stores translated application permission scopes
  const [loading, setLoading] = useState(true); // Manages render-blocking states during asynchronous database lookups

  useEffect(() => {
    const fetchRights = async () => {
      // Guard Clause: Prevent executing database network tasks if user is unauthenticated
      if (user?.id) {
        setLoading(true); // Explicitly state load initialization state prior to execution

        // Fetch application module access states mapped to this unique account identifier
        const { data, error } = await supabase
          .from('UserModule_Rights')
          .select('module_code, has_access')
          .eq('userId', user.id);

        if (!error && data) {
          // Transform data payload into an object key map for instantaneous O(1) checks in components
          const rightsMap = data.reduce((acc, curr) => {
            acc[curr.module_code] = curr.has_access;
            return acc;
          }, {});
          
          setRights(rightsMap);
        }
      }
      setLoading(false); // Terminate runtime load sequences regardless of data presence
    };

    fetchRights();
  }, [user]); // Re-evaluates permissions dynamically whenever the authenticated state shifts

  // Centralized Gating Logic for Sidebar and Permissions
  const value = {
    rights,
    loading,
    canAdd: rights.PRD_ADD === 1,
    canEdit: rights.PRD_EDIT === 1,
    canDelete: rights.PRD_DEL === 1,
    // Instantly evaluate core administrative overrides based on raw table metadata
    isAdmin: user?.user_type === 'ADMIN' || user?.user_type === 'SUPERADMIN'
  };

  return (
    <UserRightsContext.Provider value={value}>
      {children}
    </UserRightsContext.Provider>
  );
};

// 2. Custom hooks wrapper for consuming rights data within sub-modules cleanly
export const useRights = () => {
  const context = useContext(UserRightsContext);
  
  // Guard clause against developer configuration oversights during layout updates
  if (!context) {
    throw new Error('useRights must be used within a UserRightsProvider');
  }
  
  return context;
};
