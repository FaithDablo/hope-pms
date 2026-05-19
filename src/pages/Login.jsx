import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user } = useAuth(); // Read current session state dynamically if needed
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      
      // Initialize Supabase third-party OAuth handshake for Google Login
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Points directly to the AuthCallback route we registered in App.jsx
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('OAuth Authentication Error:', error.message);
      alert('Authentication Failed: Unable to initialize Google Login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-6 text-center">
        
        {/* Application Brand Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center bg-indigo-50 p-3 rounded-2xl text-indigo-600 mb-2">
            <span className="material-symbols-outlined text-4xl">medical_services</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome to HOPE PMS</h2>
          <p className="text-sm text-slate-500">Hospital Operations Management & Patient Management System</p>
        </div>

        <hr className="border-slate-100" />

        {/* OAuth Form Interaction Area */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Secure Access Portal</p>
          
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              // Clean inline SVG representation of the official Google Branding Icon
              <svg className="w-5 h-5 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.742 1.054 15.014 0 12 0 7.354 0 3.373 2.645 1.391 6.505l3.875 3.26z"
                />
                <path
                  fill="#4285F4"
                  d="M16.04 15.345c-1.077.736-2.423 1.164-4.04 1.164-2.955 0-5.464-1.991-6.355-4.664L1.77 15.11C3.814 19.173 8.04 22 13 22c3.19 0 6.045-1.073 8.127-2.909l-3.69-3.218z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.645 11.845a6.836 6.836 0 0 1 0-1.69l-3.873-3.26A11.91 11.91 0 0 0 1 12c0 1.864.427 3.627 1.19 5.218l3.455-3.373z"
                />
                <path
                  fill="#34A853"
                  d="M23 12c0-.764-.068-1.5-.19-2.209H13v4.182h5.618a4.805 4.805 0 0 1-2.073 3.154l3.69 3.218C22.395 18.255 24 15.364 24 12z"
                />
              </svg>
            )}
            <span>{loading ? 'Connecting to Google...' : 'Sign in with Google'}</span>
          </button>
        </div>

        {/* System Footer Metadata */}
        <p className="text-xs text-slate-400">
          Authorized personnel access only. Actions within this workspace are subject to real-time compliance logging.
        </p>

      </div>
    </div>
  );
}
