import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Breadcrumb, ProductCard, Spinner } from '../components/common';

const LOCAL_IMGS = [
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
const getLocalImg = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return LOCAL_IMGS[hash % LOCAL_IMGS.length];
};
const FALLBACKS = {
  'Black Tea': '/assets/images/products/product-9.png',
  'Green Tea': '/assets/images/products/product-2.png',
  'White Tea': '/assets/images/products/product-1.png',
  'Matcha':    '/assets/images/products/product-3.png',
  'Herbal Tea':'/assets/images/products/product-5.png',
  'Chai':      '/assets/images/products/product-4.png',
  'Oolong':    '/assets/images/products/product-7.png',
  'Rooibos':   '/assets/images/products/product-8.png',
  'Taiwanese': '/assets/images/products/product-6.png',
};

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct]   = useState(null);
  const [related, setRelated]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selVariant, setSelVariant] = useState(null);
  const [qty, setQty]           = useState(1);
  const [adding, setAdding]     = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [r1, r2] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/products/${id}/related`),
        ]);
        setProduct(r1.data.product);
        setRelated(r2.data.products);
        if (r1.data.product.variants?.length) setSelVariant(r1.data.product.variants[0]);
      } catch { navigate('/collections'); }
      finally { setLoading(false); }
    };
    load();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    if (!selVariant) { toast.error('Please select a weight'); return; }
    setAdding(true);
    const res = await addToCart(product._id, selVariant._id, qty);
    if (res.success) toast.success('Added to bag!');
    else toast.error(res.message);
    setAdding(false);
  };

  if (loading) return <Spinner />;
  if (!product) return null;

  const imgSrc = product.images?.[0]
    ? (product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000${product.images[0]}`)
    : FALLBACKS[product.category] || FALLBACKS['Chai'];

  const price = selVariant?.price || product.variants?.[0]?.price || 0;

  return (
    <div className="bg-[#f5f5f3]">
      <div className="max-w-[1100px] mx-auto px-6 py-8">

        <Breadcrumb items={[
          { label:'Home', href:'/' },
          { label:'Collections', href:'/collections' },
          { label: product.category, href:`/collections?category=${product.category}` },
          { label: product.name },
        ]} />

        {/* ── Product Main ── */}
        <div className="grid grid-cols-2 gap-16 mb-16">

          {/* Left: Image */}
          <div className="bg-[#eeede9] border border-[#e0ddd8] p-8 flex items-center justify-center aspect-square">
            <img
              src={imgSrc}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
              onError={e => { e.target.onerror = null; e.target.src = FALLBACKS[product.category] || FALLBACKS['Chai']; }}
            />
          </div>

          {/* Right: Info */}
          <div>
            <h1 className="font-serif text-[28px] font-light text-[#1a1a1a] leading-snug mb-3">{product.name}</h1>
            <p className="text-sm font-sans text-[#4a4a4a] leading-relaxed mb-4">{product.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-4 mb-5">
              {product.origin && (
                <span className="flex items-center gap-1.5 text-[10px] tracking-[1.5px] uppercase font-sans text-[#4a4a4a]">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {product.origin}
                </span>
              )}
              {product.isOrganic && <span className="text-[10px] tracking-[1.5px] uppercase font-sans text-[#4a4a4a]">✦ Organic</span>}
              {product.isVegan  && <span className="text-[10px] tracking-[1.5px] uppercase font-sans text-[#4a4a4a]">✦ Vegan</span>}
            </div>

            {/* Price */}
            <p className="font-serif text-[28px] text-[#1a1a1a] mb-5">€{price.toFixed(2)}</p>

            {/* Variants */}
            <div className="mb-5">
              <p className="label-sm mb-2.5">Weight</p>
              <div className="flex gap-2 flex-wrap">
                {product.variants.map(v => (
                  <button key={v._id} onClick={() => setSelVariant(v)}
                    disabled={v.stock === 0}
                    className={`px-3.5 py-1.5 text-[11px] font-sans border cursor-pointer transition-all duration-150
                      ${selVariant?._id === v._id
                        ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                        : 'border-[#e0ddd8] bg-white text-[#1a1a1a] hover:border-[#1a1a1a]'}
                      ${v.stock === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}>
                    {v.weight}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Add to bag */}
            <div className="flex gap-3 items-center mb-5">
              <div className="flex items-center border border-[#e0ddd8] bg-white">
                <button onClick={() => setQty(q => Math.max(1, q-1))}
                  className="w-9 h-9 text-base bg-transparent border-none cursor-pointer text-[#1a1a1a] hover:bg-[#f5f5f3]">−</button>
                <span className="w-8 text-center text-sm font-sans">{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="w-9 h-9 text-base bg-transparent border-none cursor-pointer text-[#1a1a1a] hover:bg-[#f5f5f3]">+</button>
              </div>
              <button onClick={handleAddToCart}
                disabled={adding || !selVariant || selVariant?.stock === 0}
                className="flex-1 py-2.5 bg-[#1a1a1a] text-white text-[11px] tracking-[2px] uppercase font-sans border-none cursor-pointer hover:bg-[#4a4a4a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {adding ? 'Adding...' : selVariant?.stock === 0 ? 'Out of Stock' : '+ Add to Bag'}
              </button>
            </div>

            {selVariant && (
              <p className={`text-[11px] font-sans ${selVariant.stock < 10 ? 'text-red-500' : 'text-[#8a8a8a]'}`}>
                {selVariant.stock} in stock
              </p>
            )}
          </div>
        </div>

        {/* ── Steeping + About ── */}
        <div className="grid grid-cols-2 gap-12 mb-16 bg-white border border-[#e0ddd8] p-10">
          <div>
            <h3 className="font-serif text-[18px] mb-5">Steeping instructions</h3>
            {product.steepeingInstructions && (
              <div className="space-y-2">
                {[
                  ['Serving Size', product.steepeingInstructions.servingSize],
                  ['Water Temp',   product.steepeingInstructions.waterTemp],
                  ['Steeping Time',product.steepeingInstructions.steepingTime],
                  ['Color After',  product.steepeingInstructions.colorAfter],
                ].filter(([,v]) => v).map(([label, value]) => (
                  <div key={label} className="flex gap-3">
                    <span className="label-sm min-w-[100px]">{label}</span>
                    <span className="text-xs font-sans text-[#1a1a1a]">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-serif text-[18px] mb-5">About this tea</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {product.flavor?.length > 0 && (
                <div><span className="label-sm block mb-1">Flavour</span><span className="text-xs font-sans text-[#1a1a1a]">{product.flavor.join(', ')}</span></div>
              )}
              {product.qualities && (
                <div><span className="label-sm block mb-1">Qualities</span><span className="text-xs font-sans text-[#1a1a1a]">{product.qualities}</span></div>
              )}
              {product.caffeine && (
                <div><span className="label-sm block mb-1">Caffeine</span><span className="text-xs font-sans text-[#1a1a1a]">{product.caffeine}</span></div>
              )}
            </div>
            {product.ingredients && (
              <div className="border-t border-[#e0ddd8] pt-4">
                <p className="label-sm mb-2">Ingredients</p>
                <p className="text-xs font-sans text-[#4a4a4a] leading-relaxed">{product.ingredients}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── You May Also Like ── */}
        {related.length > 0 && (
          <section>
            <h2 className="font-serif text-[28px] font-light text-center text-[#1a1a1a] mb-8">You may also like</h2>
            <div className="grid grid-cols-4 gap-4">
              {related.slice(0,4).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
