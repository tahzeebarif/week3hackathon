import React from 'react';
import { Link } from 'react-router-dom';

const COLS = [
  { title: 'Collections', links: ['Black Tea','Green Tea','White Tea','Matcha','Chai','Herbal Tea','Oolong','Rooibos','Taiwanese'] },
  { title: 'Learn',       links: ['About us','About our teas','Tea Academy'] },
  { title: 'Customer Service', links: ['Ordering and payment','Delivery','Privacy and policy','Terms & Conditions'] },
];

export default function Footer() {
  return (
    <footer className="bg-[#eeede9] border-t border-[#e0ddd8] mt-20">
      <div className="max-w-[1100px] mx-auto px-6 py-12 grid grid-cols-4 gap-10">

        {COLS.map(c => (
          <div key={c.title}>
            <p className="text-[10px] tracking-[2px] uppercase font-sans font-semibold text-[#1a1a1a] mb-4">
              {c.title}
            </p>
            {c.links.map(l => (
              <Link key={l}
                to={c.title === 'Collections' ? `/collections?category=${l}` : '/'}
                className="block text-xs font-sans text-[#4a4a4a] mb-2 hover:text-[#1a1a1a] transition-colors">
                {l}
              </Link>
            ))}
          </div>
        ))}

        {/* Contact */}
        <div>
          <p className="text-[10px] tracking-[2px] uppercase font-sans font-semibold text-[#1a1a1a] mb-4">
            Contact Us
          </p>
          <div className="flex gap-2 mb-3">
            <svg className="w-3 h-3 mt-0.5 flex-shrink-0 text-[#8a8a8a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-[11px] font-sans text-[#4a4a4a] leading-relaxed">
              3 Pavels Road, 14 Pemberton Ave, Shirley, First Provinceville, USA
            </span>
          </div>
          <div className="flex gap-2 mb-3 items-center">
            <svg className="w-3 h-3 flex-shrink-0 text-[#8a8a8a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span className="text-[11px] font-sans text-[#4a4a4a]">Email: info@shop@gmail.com</span>
          </div>
          <div className="flex gap-2 items-center">
            <svg className="w-3 h-3 flex-shrink-0 text-[#8a8a8a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span className="text-[11px] font-sans text-[#4a4a4a]">Tel: +44 4713000086</span>
          </div>
        </div>
      </div>

      <div className="border-t border-[#e0ddd8] py-4 text-center">
        <p className="text-[11px] font-sans text-[#8a8a8a]">© 2026 Brand Name. All rights reserved.</p>
      </div>
    </footer>
  );
}
