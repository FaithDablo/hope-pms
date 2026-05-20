import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. Auth Check (Email & Password)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setMessage({ type: 'error', text: authError.message });
      setLoading(false);
      return;
    }

    // 2. Database Status Check (Dito natin titingnan ang record_status)
    // Table: 'user' | Column: 'record_status'
    const { data: userData } = await supabase
      .from('user') 
      .select('record_status')
      .eq('id', authData.user.id) 
      .single();

    if (userData?.record_status === 'INACTIVE') {
      // NAPAKAHALAGA: Kailangan i-sign out para masira ang session
      await supabase.auth.signOut(); 
      setMessage({ type: 'error', text: 'Account is INACTIVE. Access denied.' });
      setLoading(false);
      return;
    }

    // 3. Success Redirect
    navigate('/Products');
  }; // <--- Heto ang nawawalang bracket mo kanina kaya nag-e-error!

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative font-['Inter']">
      
      {/* Background Visuals - Design Maintained */}
      <div className="fixed inset-0 -z-10 bg-[#f8faff]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#3525cd]/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 backdrop-blur-[100px]"></div>
      </div>

      <main className="w-full max-w-[450px] z-10 p-4">
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="bg-[#3525cd] shadow-lg shadow-[#3525cd]/30 p-2 rounded-xl mb-3 relative">
            <span className="material-symbols-outlined text-white text-3xl block">inventory_2</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0b1c30]">
            Product Management System
          </h1>
          <p className="text-sm text-[#464555] mt-1 font-medium">Hope.Inc @2026</p>
        </div>

        {/* Card */}
        <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl overflow-hidden p-6 md:p-8">
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#0b1c30]">Sign in</h2>
            <p className="text-xs text-[#464555]">Access your professional workspace</p>
          </div>

          {/* Centralized Alert Message */}
          {message.text && (
            <div className={`mb-5 p-3 rounded-lg text-xs text-center font-bold border ${
              message.type === 'error' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0b1c30] mb-1 uppercase tracking-wider">Email address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#464555] text-xl">mail</span>
                <input 
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-[#c7c4d8] rounded-lg text-sm focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none transition-all" 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-semibold text-[#0b1c30] uppercase tracking-wider">Password</label>
                <a className="text-xs text-[#3525cd] font-medium hover:underline" href="#">Forgot?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#464555] text-xl">lock</span>
                <input 
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-[#c7c4d8] rounded-lg text-sm focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none transition-all" 
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                />
              </div>
            </div>

            <button 
              className="w-full bg-[#3525cd] hover:bg-[#2b1ea3] text-white font-medium py-3 rounded-lg shadow-md active:scale-[0.98] transition-all duration-200 mt-2 disabled:opacity-50" 
              type="submit" disabled={loading}
            >
              {loading ? 'Verifying status...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#c7c4d8]"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
              <span className="bg-[#f8faff] px-2 text-[#464555] font-bold">Or continue with</span>
            </div>
          </div>

          {/* Google SSO */}
          <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#c7c4d8] rounded-lg bg-white/80 hover:bg-white shadow-sm transition-all active:scale-[0.98]">
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            <span className="text-sm font-semibold text-[#0b1c30]">Sign in with Google</span>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-[#464555]">
            Don't have an account? <a className="text-[#3525cd] font-bold hover:underline" href="/register">Create now</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;