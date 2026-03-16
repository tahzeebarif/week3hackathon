import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const FIELDS = [
  { name:'name',     label:'Full Name',       type:'text',     placeholder:'John Doe'        },
  { name:'email',    label:'Email Address',   type:'email',    placeholder:'your@email.com'  },
  { name:'password', label:'Password',        type:'password', placeholder:'••••••••'        },
  { name:'confirm',  label:'Confirm Password',type:'password', placeholder:'••••••••'        },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]       = useState({ name:'', email:'', password:'', confirm:'' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name = 'Name is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    const res = await register(form.name, form.email, form.password);
    setLoading(false);
    if (res.success) { toast.success('Account created!'); navigate('/'); }
    else toast.error(res.message);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f5f5f3] px-6 py-12">
      <div className="w-full max-w-sm">

        <div className="text-center mb-10">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5" className="mx-auto mb-3">
            <path d="M17 8h1a4 4 0 0 1 0 8h-1"/>
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
            <line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>
          </svg>
          <h1 className="font-serif text-[30px] font-light text-[#1a1a1a] mb-1">Create Account</h1>
          <p className="text-xs font-sans text-[#8a8a8a]">Join our tea community</p>
        </div>

        <div className="bg-white border border-[#e0ddd8] p-8">
          <form onSubmit={handleSubmit}>
            {FIELDS.map(f => (
              <div key={f.name} className="mb-4">
                <label className="label-sm block mb-1">{f.label}</label>
                <input type={f.type} value={form[f.name]} placeholder={f.placeholder}
                  onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                  className={`input-field ${errors[f.name] ? 'border-red-400' : ''}`} />
                {errors[f.name] && <p className="text-[10px] text-red-500 font-sans mt-1">{errors[f.name]}</p>}
              </div>
            ))}
            <div className="mt-6">
              <button type="submit" disabled={loading} className="btn-dark w-full text-center block"
                style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
          <p className="text-center text-xs font-sans text-[#8a8a8a] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1a1a1a] font-semibold underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
