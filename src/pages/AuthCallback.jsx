import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Listen for the auth state transition to catch the Google OAuth token handshake
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // Once the session token is securely parsed, route the user to the default gateway
        navigate('/dashboard'); 
      }
    });

    // 2. Clean up the event subscription when this unmounting view finishes its job
    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center space-y-3">
        {/* Simple professional loading UI */}
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-medium text-slate-500 animate-pulse">Authenticating secure session... Please wait.</p>
      </div>
    </div>
  );
}
