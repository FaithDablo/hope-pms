import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Makinig sa auth events para masiguro na kumpleto ang pag-inject ng access tokens at metadata
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Kapag kumpirmadong pumasok na ang login event, i-redirect sa Products
        navigate('/products', { replace: true });
      } else if (event === 'INITIAL_SESSION' && session) {
        // Kung may active session na agad, rekta pasok
        navigate('/products', { replace: true });
      } else if (event === 'SIGNED_OUT') {
        // Fallback kapag nabigo ang handshake
        navigate('/login', { replace: true });
      }
    });

    // Safety timeout fallback: Kung sakaling mag-hang ang OAuth handshake ng higit sa 5 segundo
    const timeout = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/products', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
        <p className="text-lg font-medium text-slate-600 font-['Inter']">Completing authentication...</p>
        <p className="text-xs text-slate-400 font-['Inter']">Syncing database permissions matrix...</p>
      </div>
    </div>
  );
};

export default AuthCallback;