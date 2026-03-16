import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckoutSteps } from '../components/common';

const FIELDS = [
  { name:'fullName',   label:'Full Name',       type:'text',     placeholder:'John Doe',           full: false },
  { name:'email',      label:'Email Address',    type:'email',    placeholder:'john@example.com',   full: false },
  { name:'phone',      label:'Phone Number',     type:'tel',      placeholder:'+44 000 000 0000',   full: false },
  { name:'street',     label:'Street Address',   type:'text',     placeholder:'123 Tea Street',     full: true  },
  { name:'city',       label:'City',             type:'text',     placeholder:'London',             full: false },
  { name:'postalCode', label:'Postal Code',      type:'text',     placeholder:'SW1A 1AA',           full: false },
  { name:'country',    label:'Country',          type:'text',     placeholder:'United Kingdom',     full: false },
];

export default function DeliveryPage() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ fullName:'', email:'', phone:'', street:'', city:'', postalCode:'', country:'' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.fullName)  e.fullName  = 'Required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone)     e.phone     = 'Required';
    if (!form.street)    e.street    = 'Required';
    if (!form.city)      e.city      = 'Required';
    if (!form.postalCode) e.postalCode = 'Required';
    if (!form.country)   e.country   = 'Required';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    sessionStorage.setItem('shippingAddress', JSON.stringify(form));
    navigate('/payment');
  };

  return (
    <div className="bg-[#f5f5f3]">
      <div className="max-w-[1100px] mx-auto px-6 py-10">
        <CheckoutSteps current={2} />

        <div className="grid grid-cols-[1fr_300px] gap-12">

          {/* ── Form ── */}
          <div>
            <h2 className="font-serif text-[26px] font-light mb-8 text-[#1a1a1a]">Delivery Information</h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-5">
                {FIELDS.map(f => (
                  <div key={f.name} className={f.full ? 'col-span-2' : 'col-span-1'}>
                    <label className="label-sm block mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={form[f.name]}
                      onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                      className={`input-field ${errors[f.name] ? 'border-red-400' : ''}`}
                    />
                    {errors[f.name] && (
                      <p className="text-[10px] text-red-500 font-sans mt-1">{errors[f.name]}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                <button type="button" onClick={() => navigate('/cart')} className="btn-outline">
                  ← Back to Bag
                </button>
                <button type="submit" className="btn-dark">
                  Continue to Payment →
                </button>
              </div>
            </form>
          </div>

          {/* ── Info Panel ── */}
          <div>
            <div className="bg-white border border-[#e0ddd8] p-7">
              <h3 className="font-serif text-[20px] font-light mb-5">Delivery Info</h3>
              {[
                { icon:'🚚', text:'Standard delivery: 3–5 business days' },
                { icon:'⚡', text:'Express delivery: 1–2 business days' },
                { icon:'🔄', text:'Free returns within 30 days' },
                { icon:'📦', text:'Free delivery on orders over €40' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 mb-4 items-start">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-xs font-sans text-[#4a4a4a] leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
