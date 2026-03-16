import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckoutSteps } from '../components/common';

const FALLBACK = 'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=100&h=100&fit=crop';

export default function CartPage() {
  const { cart, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;
  const delivery = 3.96;
  const total    = subtotal + delivery;

  if (!cart.items?.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#f5f5f3] px-6">
        <h2 className="font-serif text-[32px] font-light mb-4 text-[#1a1a1a]">Your bag is empty</h2>
        <p className="text-sm font-sans text-[#8a8a8a] mb-8">Discover our premium tea collection.</p>
        <Link to="/collections"><button className="btn-dark">Browse Teas</button></Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f3]">
      <div className="max-w-[1100px] mx-auto px-6 py-10">
        <CheckoutSteps current={1} />

        <div className="grid grid-cols-[1fr_320px] gap-12">

          {/* ── Left: Items ── */}
          <div>
            {cart.items.map(item => {
              const imgSrc = item.product?.images?.[0]
                ? (item.product.images[0].startsWith('http') ? item.product.images[0] : `http://localhost:5000${item.product.images[0]}`)
                : FALLBACK;
              return (
                <div key={item._id} className="flex gap-5 py-5 border-b border-[#e0ddd8] items-start">
                  {/* Image */}
                  <div className="w-20 h-20 bg-[#eeede9] border border-[#e0ddd8] flex-shrink-0 overflow-hidden">
                    <img src={imgSrc} alt={item.product?.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.onerror = null; e.target.src = FALLBACK; }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h4 className="text-[13px] font-sans font-medium text-[#1a1a1a] mb-1">
                      {item.product?.name || 'Tea Product'}
                    </h4>
                    <p className="text-[11px] font-sans text-[#8a8a8a] mb-3">
                      {item.weight} — €{item.price?.toFixed(2)}
                    </p>
                    {/* Qty */}
                    <div className="flex items-center border border-[#e0ddd8] bg-white w-fit">
                      <button onClick={() => updateItem(item._id, item.quantity - 1)}
                        className="w-8 h-7 bg-transparent border-none cursor-pointer text-[#1a1a1a] text-base hover:bg-[#f5f5f3]">−</button>
                      <span className="px-3 text-xs font-sans text-[#1a1a1a]">{item.quantity}</span>
                      <button onClick={() => updateItem(item._id, item.quantity + 1)}
                        className="w-8 h-7 bg-transparent border-none cursor-pointer text-[#1a1a1a] text-base hover:bg-[#f5f5f3]">+</button>
                    </div>
                  </div>

                  {/* Price + Remove */}
                  <div className="text-right">
                    <p className="text-[13px] font-sans font-medium text-[#1a1a1a] mb-2">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button onClick={() => removeItem(item._id)}
                      className="text-[10px] font-sans text-[#8a8a8a] bg-transparent border-none cursor-pointer underline uppercase tracking-wide hover:text-[#1a1a1a]">
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Subtotal */}
            <div className="flex justify-between py-5 border-b border-[#e0ddd8]">
              <span className="text-xs font-sans tracking-[1px] uppercase text-[#1a1a1a]">Subtotal</span>
              <span className="text-[13px] font-sans font-medium">€{subtotal.toFixed(2)}</span>
            </div>

            <div className="mt-5">
              <Link to="/collections"><button className="btn-outline">← Back to Shopping</button></Link>
            </div>
          </div>

          {/* ── Right: Summary ── */}
          <div>
            <div className="bg-white border border-[#e0ddd8] p-7">
              <h3 className="font-serif text-[20px] font-light mb-6">Order summary</h3>

              <div className="flex justify-between mb-3">
                <span className="text-xs font-sans text-[#4a4a4a]">Subtotal</span>
                <span className="text-xs font-sans">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pb-5 mb-5 border-b border-[#e0ddd8]">
                <span className="text-xs font-sans text-[#4a4a4a]">Delivery</span>
                <span className="text-xs font-sans">€{delivery.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-6">
                <span className="text-[13px] font-sans font-semibold uppercase tracking-[1px]">Total</span>
                <span className="text-[14px] font-sans font-semibold">€{total.toFixed(2)}</span>
              </div>

              <p className="text-[10px] font-sans text-[#8a8a8a] mb-5">Estimated delivery in 2 days</p>

              <button onClick={() => navigate('/delivery')} className="btn-dark w-full text-center block">
                Check Out
              </button>

              {/* Payment icons */}
              <div className="mt-5">
                <p className="text-[10px] font-sans text-[#8a8a8a] mb-2">Payment type</p>
                <div className="flex gap-2 flex-wrap">
                  {['VISA','MC','AMEX','PayPal'].map(p => (
                    <div key={p} className="border border-[#e0ddd8] px-2 py-1 text-[9px] font-sans text-[#4a4a4a] tracking-wide">
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery notes */}
              <div className="mt-5 border-t border-[#e0ddd8] pt-4 space-y-2">
                {[
                  'Only before 12:00 AM will ship the same day',
                  'Orders made after friday 12:00 are processed on Monday',
                  'To return your package, please contact us first',
                  'Digital products for refund are not reimbursed',
                ].map((note, i) => (
                  <p key={i} className="text-[10px] font-sans text-[#8a8a8a] pl-2 border-l-2 border-[#e0ddd8]">
                    {note}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
