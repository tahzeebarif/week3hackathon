import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const CATEGORIES = [
  'Black Tea','Green Tea','White Tea','Matcha',
  'Herbal Tea','Chai','Oolong','Rooibos','Taiwanese'
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount }    = useCart();
  const navigate         = useNavigate();
  const [collOpen, setCollOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-[#e0ddd8] sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-8 h-14 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2 font-serif text-[15px] font-medium text-[#1a1a1a] flex-shrink-0">
          <img
            src="/assets/images/logo.png"
            alt="Brand Logo"
            className="w-5 h-5 object-contain"
          />
          Brand Name
        </Link>

        {/* ── Center Nav ── */}
        <div className="flex items-center gap-10">

          {/* Tea Collections Dropdown */}
          <div className="relative"
            onMouseEnter={() => setCollOpen(true)}
            onMouseLeave={() => setCollOpen(false)}>
            <button className="text-[11px] tracking-[2px] uppercase font-sans text-[#1a1a1a] hover:text-[#8a8a8a] transition-colors cursor-pointer bg-transparent border-none">
              Tea Collections
            </button>
            {collOpen && (
              <div className="absolute top-full left-0 bg-white border border-[#e0ddd8] shadow-sm min-w-[180px] py-1 z-50">
                {CATEGORIES.map(c => (
                  <Link key={c} to={`/collections?category=${c}`}
                    onClick={() => setCollOpen(false)}
                    className="block px-4 py-2 text-xs font-sans text-[#1a1a1a] hover:bg-[#f5f5f3] transition-colors">
                    {c}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/collections" className="text-[11px] tracking-[2px] uppercase font-sans text-[#1a1a1a] hover:text-[#8a8a8a] transition-colors">
            Accessories
          </Link>
          <Link to="/" className="text-[11px] tracking-[2px] uppercase font-sans text-[#1a1a1a] hover:text-[#8a8a8a] transition-colors">
            Blog
          </Link>
          <Link to="/" className="text-[11px] tracking-[2px] uppercase font-sans text-[#1a1a1a] hover:text-[#8a8a8a] transition-colors">
            Contact Us
          </Link>
        </div>

        {/* ── Right Icons ── */}
        <div className="flex items-center gap-5 flex-shrink-0">

          {/* Search */}
          <button onClick={() => navigate('/collections')}
            className="text-[#1a1a1a] hover:text-[#8a8a8a] transition-colors bg-transparent border-none cursor-pointer flex items-center">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>

          {/* User Dropdown */}
          <div className="relative"
            onMouseEnter={() => setUserOpen(true)}
            onMouseLeave={() => setUserOpen(false)}>
            <button className="text-[#1a1a1a] hover:text-[#8a8a8a] transition-colors bg-transparent border-none cursor-pointer flex items-center">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
            {userOpen && (
              <div className="absolute top-full right-0 bg-white border border-[#e0ddd8] shadow-sm min-w-[160px] py-1 z-50">
                {user ? (
                  <>
                    <Link to="/account" className="block px-4 py-2 text-xs font-sans text-[#1a1a1a] hover:bg-[#f5f5f3] transition-colors">
                      My Account
                    </Link>
                    {(user.role === 'admin' || user.role === 'superadmin') && (
                      <Link to="/admin" className="block px-4 py-2 text-xs font-sans text-[#1a1a1a] hover:bg-[#f5f5f3] transition-colors">
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={logout}
                      className="w-full text-left px-4 py-2 text-xs font-sans text-[#1a1a1a] hover:bg-[#f5f5f3] transition-colors bg-transparent border-none cursor-pointer">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-2 text-xs font-sans text-[#1a1a1a] hover:bg-[#f5f5f3] transition-colors">
                      Login
                    </Link>
                    <Link to="/register" className="block px-4 py-2 text-xs font-sans text-[#1a1a1a] hover:bg-[#f5f5f3] transition-colors">
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative text-[#1a1a1a] hover:text-[#8a8a8a] transition-colors flex items-center">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#1a1a1a] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-sans">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

      </div>
    </nav>
  );
}
