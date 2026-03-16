import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/common';

const STATUS_COLORS = {
  pending:   'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped:   'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const FALLBACK = 'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=80&h=80&fit=crop';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab]         = useState('orders');
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState({ name: user?.name || '', phone: '', address: '' });
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/orders/my-orders')
      .then(r => setOrders(r.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleSaveProfile = async (ev) => {
    ev.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/update-profile', form);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  const TABS = [
    { id:'orders',  label:'My Orders' },
    { id:'profile', label:'Profile'   },
  ];

  return (
    <div className="bg-[#f5f5f3]">
      <div className="max-w-[1100px] mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-[32px] font-light text-[#1a1a1a]">My Account</h1>
            <p className="text-xs font-sans text-[#8a8a8a] mt-1">{user?.email}</p>
          </div>
          <button onClick={logout}
            className="text-[11px] tracking-[2px] uppercase font-sans text-[#8a8a8a] bg-transparent border-none cursor-pointer hover:text-[#1a1a1a] transition-colors">
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#e0ddd8] mb-8">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-6 py-3 text-[11px] tracking-[2px] uppercase font-sans bg-transparent border-none cursor-pointer transition-colors
                ${tab === t.id
                  ? 'border-b-2 border-[#1a1a1a] text-[#1a1a1a] font-semibold -mb-[1px]'
                  : 'text-[#8a8a8a] hover:text-[#1a1a1a]'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Orders Tab ── */}
        {tab === 'orders' && (
          loading ? <Spinner /> : orders.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-serif text-[22px] font-light text-[#1a1a1a] mb-2">No orders yet</p>
              <p className="text-xs font-sans text-[#8a8a8a] mb-6">Start exploring our tea collection</p>
              <button onClick={() => navigate('/collections')} className="btn-dark">Browse Teas</button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="bg-white border border-[#e0ddd8] p-6">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className="text-[10px] tracking-[2px] uppercase font-sans text-[#8a8a8a] mb-1">Order ID</p>
                      <p className="text-xs font-sans font-mono text-[#1a1a1a]">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] tracking-[1px] uppercase font-sans px-3 py-1 rounded-sm ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                      <p className="text-[10px] font-sans text-[#8a8a8a] mt-2">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-5">
                    {order.items.map((item, i) => {
                      const imgSrc = item.product?.images?.[0]
                        ? (item.product.images[0].startsWith('http') ? item.product.images[0] : `http://localhost:5000${item.product.images[0]}`)
                        : FALLBACK;
                      return (
                        <div key={i} className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#eeede9] border border-[#e0ddd8] flex-shrink-0 overflow-hidden">
                            <img src={imgSrc} alt=""
                              className="w-full h-full object-cover"
                              onError={e => { e.target.onerror = null; e.target.src = FALLBACK; }} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[12px] font-sans text-[#1a1a1a]">{item.name}</p>
                            <p className="text-[11px] font-sans text-[#8a8a8a]">{item.weight} × {item.quantity}</p>
                          </div>
                          <span className="text-[12px] font-sans text-[#1a1a1a]">
                            €{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center border-t border-[#e0ddd8] pt-4">
                    <div className="text-xs font-sans text-[#4a4a4a]">
                      {order.shippingAddress?.city}, {order.shippingAddress?.country}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-sans text-[#8a8a8a] uppercase tracking-wide">Total</p>
                      <p className="text-[14px] font-sans font-semibold text-[#1a1a1a]">€{order.total?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── Profile Tab ── */}
        {tab === 'profile' && (
          <div className="max-w-md">
            <div className="bg-white border border-[#e0ddd8] p-8">
              <h3 className="font-serif text-[20px] font-light text-[#1a1a1a] mb-6">Profile Information</h3>
              <form onSubmit={handleSaveProfile}>
                {[
                  { name:'name',    label:'Full Name',    type:'text',  placeholder:'John Doe'         },
                  { name:'phone',   label:'Phone Number', type:'tel',   placeholder:'+44 000 000 0000' },
                  { name:'address', label:'Address',      type:'text',  placeholder:'Your address'     },
                ].map(f => (
                  <div key={f.name} className="mb-5">
                    <label className="label-sm block mb-1">{f.label}</label>
                    <input type={f.type} value={form[f.name]} placeholder={f.placeholder}
                      onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                      className="input-field" />
                  </div>
                ))}

                {/* Email (readonly) */}
                <div className="mb-6">
                  <label className="label-sm block mb-1">Email</label>
                  <input type="email" value={user?.email || ''} disabled
                    className="input-field bg-[#f5f5f3] text-[#8a8a8a] cursor-not-allowed" />
                </div>

                <button type="submit" disabled={saving} className="btn-dark"
                  style={{ opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
