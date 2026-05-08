import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', username: '', email: '', password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          user_name: formData.username,
        },
      },
    });
    if (error) alert(error.message);
    else alert('Registration successful!');
    setLoading(false);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#f5f7ff] overflow-hidden font-['Inter']"> 
     <main className="w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-4 text-center shrink-0">
          <div className="bg-[#3525cd] shadow-md p-2 rounded-xl mb-2">
            <span className="material-symbols-outlined text-white text-2xl block">inventory_2</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0b1c30]">
            Product Management System
          </h1>
          <p className="text-sm text-[#464555] mt-1 font-medium">Hope.Inc @2026</p>
        </div>

        <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl overflow-hidden p-6 md:p-8">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#0b1c30]">Sign up</h2>
            <p className="text-[11px] text-gray-500">Enter your details to get started</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#0b1c30] uppercase tracking-wider">First Name</label>
                <input name="firstName" onChange={handleChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:border-[#3525cd] outline-none transition-all" type="text" placeholder="Juan" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#0b1c30] uppercase tracking-wider">Last Name</label>
                <input name="lastName" onChange={handleChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:border-[#3525cd] outline-none transition-all" type="text" placeholder="Dela Cruz" required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#0b1c30] uppercase tracking-wider">Username</label>
              <input name="username" onChange={handleChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:border-[#3525cd] outline-none transition-all" type="text" placeholder="juan_dc" required />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#0b1c30] uppercase tracking-wider">Email Address</label>
              <input name="email" onChange={handleChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:border-[#3525cd] outline-none transition-all" type="email" placeholder="name@company.com" required />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#0b1c30] uppercase tracking-wider">Password</label>
              <input name="password" onChange={handleChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:border-[#3525cd] outline-none transition-all" type="password" placeholder="••••••••" required />
            </div>

            <button className="w-full bg-[#3525cd] text-white text-sm font-bold py-3 rounded-lg shadow-md hover:bg-[#2a1da3] active:scale-[0.98] transition-all mt-1" type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Register'}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-widest">
              <span className="bg-white px-2 text-gray-400 font-bold">Or continue with</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border border-gray-100 rounded-lg bg-white hover:bg-gray-50 text-[12px] font-bold text-[#0b1c30] transition-all" type="button">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                Sign in with Google
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[12px] text-gray-500">
            Already have an account? <Link to="/login" className="text-[#3525cd] font-bold hover:underline ml-1">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;