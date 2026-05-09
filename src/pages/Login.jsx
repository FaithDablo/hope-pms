import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // PATH 1: Email/Password (PR-02)
  const handleEmailAuth = async (type) => {
    const { error } = type === 'SIGNUP' 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) alert(error.message);
    else alert(type === 'SIGNUP' ? "Check email!" : "Welcome back!");
  };

  // PATH 2: Google OAuth (PR-03)
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px', gap: '10px' }}>
      <h2>HopePMS Access Control</h2>
      
      {/* Email Path UI */}
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <div>
        <button onClick={() => handleEmailAuth('LOGIN')}>Sign In</button>
        <button onClick={() => handleEmailAuth('SIGNUP')}>Register</button>
      </div>

      <p>— OR —</p>

      {/* Google Path UI */}
      <button onClick={handleGoogleLogin} style={{ background: '#4285F4', color: 'white' }}>
        Continue with Google
      </button>
    </div>
  );
}