import React from 'react';
import { Link } from 'react-router-dom';

// ── Local product images (cycle through these) ────────────────
const LOCAL_PRODUCT_IMGS = [
  '/assets/images/products/product-1.png',
  '/assets/images/products/product-2.png',
  '/assets/images/products/product-3.png',
  '/assets/images/products/product-4.png',
  '/assets/images/products/product-5.png',
  '/assets/images/products/product-6.png',
  '/assets/images/products/product-7.png',
  '/assets/images/products/product-8.png',
  '/assets/images/products/product-9.png',
];

// Simple hash from product name → consistent image per product
const getLocalImg = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return LOCAL_PRODUCT_IMGS[hash % LOCAL_PRODUCT_IMGS.length];
};

export function ProductCard({ product }) {
  const price  = product.variants?.[0]?.price || 0;
  const weight = product.variants?.[0]?.weight || '';

  
  const imgSrc = product.images?.[0]
    ? (product.images[0].startsWith('http')
        ? product.images[0]
        : `http://localhost:5000${product.images[0]}`)
    : getLocalImg(product.name);

  return (
    <Link to={`/product/${product._id}`} className="block group">
      <div className="bg-white border border-[#e0ddd8] hover:border-[#4a4a4a] transition-colors duration-200">
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-[#f8f8f6]">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => {
              e.target.onerror = null;
              e.target.src = getLocalImg(product.name + '1');
            }}
          />
        </div>
        {/* Info */}
        <div className="p-3.5">
          <p className="text-[9px] tracking-[2px] uppercase font-sans text-[#8a8a8a] mb-1">{product.category}</p>
          <h3 className="text-[13px] font-sans font-normal text-[#1a1a1a] leading-snug mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-sans text-[#1a1a1a] font-medium">€{price.toFixed(2)}</span>
            <span className="text-[10px] text-[#8a8a8a] font-sans">{weight}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button onClick={() => onChange(page - 1)} disabled={page === 1}
        className="px-3 py-1.5 text-xs font-sans border border-[#e0ddd8] bg-white hover:bg-[#1a1a1a] hover:text-white disabled:opacity-30 transition-colors cursor-pointer">
        ←
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onChange(p)}
          className={`px-3 py-1.5 text-xs font-sans border transition-colors cursor-pointer
            ${p === page ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'border-[#e0ddd8] bg-white hover:bg-[#1a1a1a] hover:text-white'}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages}
        className="px-3 py-1.5 text-xs font-sans border border-[#e0ddd8] bg-white hover:bg-[#1a1a1a] hover:text-white disabled:opacity-30 transition-colors cursor-pointer">
        →
      </button>
    </div>
  );
}


export function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-[10px] tracking-[2px] uppercase font-sans text-white/80">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span>/</span>}
          {item.href
            ? <a href={item.href} className="hover:text-white transition-colors">{item.label}</a>
            : <span className="text-white">{item.label}</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}


export function CheckoutSteps({ current }) {
  const steps = ['1. My Bag', '2. Delivery', '3. Review & Payment'];
  return (
    <div className="flex items-center border-b border-[#e0ddd8] pb-4 mb-9">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <span className={`text-[11px] tracking-[2px] uppercase font-sans
            ${i + 1 === current ? 'text-[#1a1a1a] font-semibold' : 'text-[#8a8a8a] font-normal'}`}>
            {s}
          </span>
          {i < steps.length - 1 && <span className="mx-4 text-[#e0ddd8]">|</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="w-7 h-7 border-2 border-[#e0ddd8] border-t-[#1a1a1a] rounded-full animate-spin" />
    </div>
  );
}
