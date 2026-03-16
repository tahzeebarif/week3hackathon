import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to:'/admin',          label:'Dashboard', icon:(
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>)},
  { to:'/admin/products', label:'Products',  icon:(
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
    </svg>)},
  { to:'/admin/orders',   label:'Orders',    icon:(
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>)},
  { to:'/admin/users',    label:'Users',     icon:(
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>)},
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (to) =>
    to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to);

  return (
    <div className="flex h-screen bg-[#f5f5f3] overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className={`bg-[#1a1a1a] text-white flex flex-col transition-all duration-200 ${collapsed ? 'w-14' : 'w-52'} flex-shrink-0`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
          {!collapsed && (
            <span className="font-serif text-[16px] font-light tracking-wide">Admin</span>
          )}
          <button onClick={() => setCollapsed(p => !p)}
            className="bg-transparent border-none cursor-pointer text-white/60 hover:text-white p-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          {NAV.map(item => (
            <Link key={item.to} to={item.to}
              className={`flex items-center gap-3 px-4 py-3 text-[11px] tracking-[1.5px] uppercase font-sans transition-colors
                ${isActive(item.to)
                  ? 'bg-white/10 text-white border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}`}>
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/10">
          {!collapsed && (
            <p className="text-[10px] font-sans text-white/40 mb-1 truncate">{user?.email}</p>
          )}
          <button onClick={() => { logout(); navigate('/'); }}
            className={`flex items-center gap-2 text-[10px] tracking-[1px] uppercase font-sans text-white/50 hover:text-white bg-transparent border-none cursor-pointer transition-colors ${collapsed ? 'justify-center' : ''}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-[#eeede9] border-b border-[#e0ddd8] h-14 flex items-center px-6 justify-between flex-shrink-0">
          <h2 className="font-serif text-[18px] font-light text-[#1a1a1a]">
            {NAV.find(n => isActive(n.to))?.label || 'Admin'}
          </h2>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-[10px] tracking-[2px] uppercase font-sans text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors">
              ← View Site
            </Link>
            <span className="text-xs font-sans text-[#4a4a4a] font-medium">{user?.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#f5f5f3]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
