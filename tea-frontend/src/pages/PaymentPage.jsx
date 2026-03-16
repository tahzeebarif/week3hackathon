import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { CheckoutSteps } from '../components/common';

const FALLBACK = 'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=80&h=80&fit=crop';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [payMethod, setPayMethod] = useState('card');
  const [placing, setPlacing]     = useState(false);

  const subtotal = cart.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;
  const delivery = 3.96;
  const total    = subtotal + delivery;

  const shippingAddress = (() => {
    try { return JSON.parse(sessionStorage.getItem('shippingAddress')); } catch { return null; }
  })();

  const handlePlaceOrder = async () => {
    if (!shippingAddress) { navigate('/delivery'); return; }
    setPlacing(true);
    try {
      await api.post('/orders/place', { shippingAddress, paymentMethod: payMethod });
      clearCart();
      navigate('/success');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setPlacing(false); }
  };

  const methods = [
    { id:'card',   label:'Credit / Debit Card' },
    { id:'paypal', label:'PayPal' },
    { id:'cash',   label:'Cash on Delivery' },
  ];

  return (
    <div className="bg-[#f5f5f3]">
      <div className="max-w-[1100px] mx-auto px-6 py-10">
        <CheckoutSteps current={3} />

        <div className="grid grid-cols-[1fr_300px] gap-12">

          {/* ── Left ── */}
          <div>
            <h2 className="font-serif text-[26px] font-light mb-6 text-[#1a1a1a]">Review Your Order</h2>

            {/* Items */}
            {cart.items?.map(item => {
              const imgSrc = item.product?.images?.[0]
                ? (item.product.images[0].startsWith('http') ? item.product.images[0] : `http://localhost:5000${item.product.images[0]}`)
                : FALLBACK;
              return (
                <div key={item._id} className="flex gap-4 py-4 border-b border-[#e0ddd8] items-center">
                  <div className="w-14 h-14 bg-[#eeede9] border border-[#e0ddd8] flex-shrink-0 overflow-hidden">
                    <img src={imgSrc} alt="" className="w-full h-full object-cover"
                      onError={e => { e.target.onerror = null; e.target.src = FALLBACK; }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-sans font-medium text-[#1a1a1a] mb-0.5">{item.product?.name}</p>
                    <p className="text-[11px] font-sans text-[#8a8a8a]">{item.weight} × {item.quantity}</p>
                  </div>
                  <span className="text-[13px] font-sans font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}

            {/* Address */}
            {shippingAddress && (
              <div className="mt-8 p-5 bg-white border border-[#e0ddd8]">
                <h4 className="label-sm block mb-3">Delivery Address</h4>
                <p className="text-xs font-sans text-[#4a4a4a] leading-relaxed">
                  {shippingAddress.fullName}<br />
                  {shippingAddress.street}<br />
                  {shippingAddress.city}, {shippingAddress.postalCode}<br />
                  {shippingAddress.country}<br />
                  {shippingAddress.phone}
                </p>
              </div>
            )}

            {/* Payment Method */}
            <div className="mt-6">
              <h4 className="label-sm block mb-4">Payment Method</h4>
              <div className="flex gap-3 flex-wrap">
                {methods.map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)}
                    className={`px-4 py-2 text-[11px] font-sans border cursor-pointer transition-all
                      ${payMethod === m.id
                        ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                        : 'border-[#e0ddd8] bg-white text-[#1a1a1a] hover:border-[#1a1a1a]'}`}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button onClick={() => navigate('/delivery')} className="btn-outline">← Edit Delivery</button>
              <button onClick={handlePlaceOrder} disabled={placing} className="btn-dark"
                style={{ opacity: placing ? 0.7 : 1 }}>
                {placing ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>

          {/* ── Right: Summary ── */}
          <div>
            <div className="bg-white border border-[#e0ddd8] p-7">
              <h3 className="font-serif text-[20px] font-light mb-6">Order Summary</h3>
              <div className="flex justify-between mb-3">
                <span className="text-xs font-sans text-[#4a4a4a]">Subtotal</span>
                <span className="text-xs font-sans">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pb-5 mb-5 border-b border-[#e0ddd8]">
                <span className="text-xs font-sans text-[#4a4a4a]">Delivery</span>
                <span className="text-xs font-sans">€{delivery.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[13px] font-sans font-semibold uppercase tracking-[1px]">Total</span>
                <span className="text-[14px] font-sans font-semibold">€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
