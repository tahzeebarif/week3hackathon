import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { ProductCard, Pagination, Breadcrumb, Spinner } from '../components/common';

const HERO_IMG = '/assets/images/collections-hero.png';

const FILTERS = {
  Collections: ['Black Tea','Green Tea','White Tea','Matcha','Herbal Tea','Chai','Oolong','Rooibos','Taiwanese'],
  Origin:      ['Sri Lanka','India','Japan','China','Taiwan','South Africa','Germany'],
  Flavour:     ['Sweet','Earthy','Floral','Spicy','Minty','Grassy','Roasted','Umami','Citrus','Creamy','Nutty'],
  Qualities:   ['Standard','Premium','Luxury'],
  Caffeine:    ['No Caffeine','Low Caffeine','Medium Caffeine','High Caffeine'],
  Allergens:   ['Lactose-Free','Gluten Free','Nut Free','Soy Free'],
};
const KEY_MAP = {
  Collections:'category', Origin:'origin', Flavour:'flavor',
  Qualities:'qualities', Caffeine:'caffeine', Allergens:'allergens',
};

export default function CollectionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]     = useState([]);
  const [pagination, setPagination] = useState({ page:1, totalPages:1, total:0 });
  const [loading, setLoading]       = useState(false);
  const [sort, setSort]             = useState('createdAt');
  const [organic, setOrganic]       = useState(false);
  const [open, setOpen]             = useState({ Collections:true, Origin:false, Flavour:false, Qualities:false, Caffeine:false, Allergens:false });
  const [sel, setSel]               = useState({
    category: searchParams.get('category') || '',
    origin:'', flavor:'', qualities:'', caffeine:'', allergens:'',
  });

  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const cat = searchParams.get('category') || '';
    setSel(prev => ({ ...prev, category: cat }));
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      p.set('page', page); p.set('limit', 9); p.set('sort', sort);
      if (organic) p.set('organic', 'true');
      Object.entries(sel).forEach(([k,v]) => { if (v) p.set(k, v); });
      const { data } = await api.get(`/products?${p}`);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [page, sort, organic, sel]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const toggleFilter = (section, value) => {
    const key = KEY_MAP[section];
    setSel(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
    setSearchParams({ page: 1 });
  };

  return (
    <div className="bg-[#f5f5f3]">

      {/* ── Hero Banner ── */}
      <div className="w-full h-44 overflow-hidden relative">
        <img
          src={HERO_IMG}
          alt="Tea Collections"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/20 flex flex-col justify-end px-8 pb-5">
          <Breadcrumb items={[
            { label:'Home', href:'/' },
            { label:'Collections', href:'/collections' },
            ...(sel.category ? [{ label: sel.category }] : []),
          ]} />
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="max-w-[1100px] mx-auto px-6 py-8 flex gap-10">

        {/* ── Sidebar ── */}
        <aside className="w-44 flex-shrink-0">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] tracking-[2px] uppercase font-sans font-semibold text-[#1a1a1a]">
              Collections ({pagination.total})
            </span>
            <button
              onClick={() => { setSel({ category:'', origin:'', flavor:'', qualities:'', caffeine:'', allergens:'' }); setSearchParams({page:1}); }}
              className="text-[9px] text-[#8a8a8a] hover:text-[#1a1a1a] font-sans uppercase tracking-wide bg-transparent border-none cursor-pointer">
              Clear
            </button>
          </div>

          {Object.entries(FILTERS).map(([section, opts]) => (
            <div key={section} className="border-t border-[#e0ddd8] py-2.5">
              <button
                onClick={() => setOpen(p => ({ ...p, [section]: !p[section] }))}
                className="w-full flex justify-between items-center bg-transparent border-none cursor-pointer py-0.5">
                <span className="text-[10px] tracking-[2px] uppercase font-sans font-medium text-[#1a1a1a]">
                  {section}
                </span>
                <span className="text-[#8a8a8a] text-lg leading-none font-light">
                  {open[section] ? '−' : '+'}
                </span>
              </button>
              {open[section] && (
                <div className="mt-2 space-y-1.5">
                  {opts.map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox"
                        checked={sel[KEY_MAP[section]] === opt}
                        onChange={() => toggleFilter(section, opt)}
                        className="w-3 h-3 accent-[#1a1a1a] cursor-pointer" />
                      <span className="text-[11px] font-sans text-[#4a4a4a] hover:text-[#1a1a1a]">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Organic toggle */}
          <div className="border-t border-[#e0ddd8] py-3 flex justify-between items-center">
            <span className="text-[10px] tracking-[2px] uppercase font-sans font-medium text-[#1a1a1a]">Organic</span>
            <button onClick={() => { setOrganic(p => !p); setSearchParams({page:1}); }}
              className={`relative w-9 h-5 rounded-full border-none cursor-pointer transition-colors duration-200
                ${organic ? 'bg-[#1a1a1a]' : 'bg-[#d0cdc8]'}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200
                ${organic ? 'left-4' : 'left-0.5'}`} />
            </button>
          </div>
        </aside>

        {/* ── Products Area ── */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-sans text-[#8a8a8a]">{pagination.total} products</span>
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] tracking-[2px] uppercase font-sans text-[#8a8a8a]">Sort by</span>
              <select value={sort}
                onChange={e => { setSort(e.target.value); setSearchParams({page:1}); }}
                className="text-xs font-sans border border-[#e0ddd8] bg-white px-2 py-1 outline-none cursor-pointer">
                <option value="createdAt">Latest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Name A–Z</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {loading ? <Spinner /> : products.length === 0 ? (
            <div className="text-center py-20 text-[#8a8a8a] font-sans text-sm">No products found</div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          <Pagination page={pagination.page} totalPages={pagination.totalPages}
            onChange={p => setSearchParams({ page: p })} />
        </div>
      </div>
    </div>
  );
}
