import React from 'react';
import { Link } from 'react-router-dom';

export default function SuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#f5f5f3] px-6">
      <div className="text-center max-w-md">
        {/* Checkmark */}
        <div className="w-20 h-20 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center mx-auto mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="font-serif text-[38px] font-light text-[#1a1a1a] mb-3">Payment Successful</h1>
        <p className="text-sm font-sans text-[#4a4a4a] leading-relaxed mb-2">
          Thank you for your order! Your tea is being prepared with care.
        </p>
        <p className="text-xs font-sans text-[#8a8a8a] mb-10">
          You will receive a confirmation email shortly.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/account"><button className="btn-outline">View My Orders</button></Link>
          <Link to="/collections"><button className="btn-dark">Continue Shopping</button></Link>
        </div>
      </div>
    </div>
  );
}
