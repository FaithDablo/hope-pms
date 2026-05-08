import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // Kapag naka-login na, dadalhin sa main page (halimbawa: /products)
        navigate('/'); 
      }
    });
  }, [navigate]);

  return <div>Authenticating... Please wait.</div>;
}