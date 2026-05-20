import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; 

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Kunin ang current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) checkUserStatus(session.user);
      setLoading(false);
    });

    // 2. Makinig sa Login/Logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkUserStatus(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // LOGIN GUARD (M4 Role Requirement)
  const checkUserStatus = async (currentUser) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();

    if (profile?.record_status === 'INACTIVE') {
      alert("🛑 ACCESS DENIED: Your account is INACTIVE. Contact Admin.");
      await supabase.auth.signOut();
      setUser(null);
    } else {
      setUser(currentUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);