import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email:'', password:'' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (res.success) { toast.success('Welcome back!'); navigate('/'); }
    else toast.error(res.message);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f5f5f3] px-6 py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5" className="mx-auto mb-3">
            <path d="M17 8h1a4 4 0 0 1 0 8h-1"/>
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
            <line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>
          </svg>
          <h1 className="font-serif text-[30px] font-light text-[#1a1a1a] mb-1">Welcome Back</h1>
          <p className="text-xs font-sans text-[#8a8a8a]">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#e0ddd8] p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="label-sm block mb-1">Email Address</label>
              <input type="email" value={form.email} placeholder="your@email.com"
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className={`input-field ${errors.email ? 'border-red-400' : ''}`} />
              {errors.email && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.email}</p>}
            </div>
            <div className="mb-7">
              <label className="label-sm block mb-1">Password</label>
              <input type="password" value={form.password} placeholder="••••••••"
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className={`input-field ${errors.password ? 'border-red-400' : ''}`} />
              {errors.password && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.password}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-dark w-full text-center block"
              style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-xs font-sans text-[#8a8a8a] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#1a1a1a] font-semibold underline">Register</Link>
          </p>
        </div>

        {/* Demo hint */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-[11px] font-sans text-amber-800">
          <strong>Demo:</strong> user@tea.com / password123
        </div>
      </div>
    </div>
  );
}
