import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; 

// 1. Create the Global Authentication Context
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // A. Fetch initial active session upon application mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        checkUserStatus(session.user);
      } else {
        setLoading(false);
      }
    });

    // B. Subscribe to auth lifecycle events (e.g., SIGNED_IN, SIGNED_OUT)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkUserStatus(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // C. Clean up the real-time websocket subscription on component unmount
    return () => subscription.unsubscribe();
  }, []);

  /**
   * SECURITY GUARD: Validates user status and role assignments against the database
   * Forcefully logs out accounts flagged with an 'INACTIVE' record status.
   */
  const checkUserStatus = async (currentUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error) throw error;

      if (profile?.record_status === 'INACTIVE') {
        alert("🛑 ACCESS DENIED: Your account is INACTIVE. Please contact your System Administrator.");
        await supabase.auth.signOut();
        setUser(null);
      } else {
        // Merge Supabase Auth metadata with customized public profile data (e.g., user_type)
        setUser({ ...currentUser, ...profile });
      }
    } catch (err) {
      console.error("Error verifying user status profile:", err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Standardized application logout sequence
   */
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {/* Block child rendering until initial verification sequence finishes */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 2. Custom hook for consuming authentication status securely across application pages
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
