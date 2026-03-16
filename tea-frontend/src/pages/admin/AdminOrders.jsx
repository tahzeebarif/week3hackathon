import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { Spinner } from '../../components/common';

const STATUSES = ['all','pending','confirmed','shipped','delivered','cancelled'];
const STATUS_COLORS = {
  pending:   'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped:   'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};
const FALLBACK = 'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=60&h=60&fit=crop';

export default function AdminOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data.orders);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      {/* Status filter tabs */}
      <div className="flex gap-1 mb-6 flex-wrap">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 text-[10px] tracking-[1.5px] uppercase font-sans border cursor-pointer transition-colors
              ${filter === s ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'bg-white text-[#4a4a4a] border-[#e0ddd8] hover:border-[#1a1a1a]'}`}>
            {s} {s === 'all' ? `(${orders.length})` : `(${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <div className="bg-white border border-[#e0ddd8] p-12 text-center">
          <p className="text-sm font-sans text-[#8a8a8a]">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order._id} className="bg-white border border-[#e0ddd8]">
              {/* Row */}
              <div className="flex items-center gap-4 px-6 py-4">
                <button onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                  className="bg-transparent border-none cursor-pointer text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {expanded === order._id
                      ? <polyline points="18 15 12 9 6 15"/>
                      : <polyline points="6 9 12 15 18 9"/>}
                  </svg>
                </button>

                <span className="text-[11px] font-mono font-sans text-[#4a4a4a] w-24 flex-shrink-0">
                  #{order._id.slice(-6).toUpperCase()}
                </span>
                <span className="text-xs font-sans text-[#1a1a1a] flex-1 min-w-0 truncate">
                  {order.user?.name || 'Guest'}
                </span>
                <span className="text-xs font-sans text-[#8a8a8a] w-28 flex-shrink-0">
                  {new Date(order.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                </span>
                <span className="text-xs font-sans font-medium text-[#1a1a1a] w-20 text-right flex-shrink-0">
                  €{order.total?.toFixed(2)}
                </span>

                {/* Status dropdown */}
                <select value={order.status}
                  onChange={e => handleStatus(order._id, e.target.value)}
                  className={`text-[10px] tracking-[1px] uppercase font-sans px-2 py-1 border cursor-pointer outline-none w-28 flex-shrink-0
                    ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                  {STATUSES.filter(s => s !== 'all').map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Expanded */}
              {expanded === order._id && (
                <div className="border-t border-[#f5f5f3] px-6 py-5">
                  <div className="grid grid-cols-2 gap-8">
                    {/* Items */}
                    <div>
                      <p className="label-sm block mb-3">Items</p>
                      <div className="space-y-3">
                        {order.items.map((item, i) => {
                          const imgSrc = item.product?.images?.[0]
                            ? (item.product.images[0].startsWith('http') ? item.product.images[0] : `http://localhost:5000${item.product.images[0]}`)
                            : FALLBACK;
                          return (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#eeede9] border border-[#e0ddd8] flex-shrink-0 overflow-hidden">
                                <img src={imgSrc} alt=""
                                  className="w-full h-full object-cover"
                                  onError={e => { e.target.onerror = null; e.target.src = FALLBACK; }} />
                              </div>
                              <div className="flex-1">
                                <p className="text-[11px] font-sans text-[#1a1a1a]">{item.name}</p>
                                <p className="text-[10px] font-sans text-[#8a8a8a]">{item.weight} × {item.quantity}</p>
                              </div>
                              <span className="text-[11px] font-sans text-[#1a1a1a]">€{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Shipping */}
                    <div>
                      <p className="label-sm block mb-3">Shipping Address</p>
                      {order.shippingAddress && (
                        <p className="text-xs font-sans text-[#4a4a4a] leading-relaxed">
                          {order.shippingAddress.fullName}<br />
                          {order.shippingAddress.street}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                          {order.shippingAddress.country}<br />
                          {order.shippingAddress.phone}
                        </p>
                      )}
                      <div className="mt-4 pt-4 border-t border-[#f5f5f3]">
                        <div className="flex justify-between mb-1">
                          <span className="text-[11px] font-sans text-[#8a8a8a]">Subtotal</span>
                          <span className="text-[11px] font-sans">€{order.subtotal?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-[11px] font-sans text-[#8a8a8a]">Delivery</span>
                          <span className="text-[11px] font-sans">€{order.deliveryFee?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-[11px] font-sans">Total</span>
                          <span className="text-[11px] font-sans">€{order.total?.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
