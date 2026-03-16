import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { Spinner, Pagination } from '../../components/common';

const CATEGORIES = ['Black Tea','Green Tea','White Tea','Matcha','Herbal Tea','Chai','Oolong','Rooibos','Taiwanese'];
const FALLBACK = 'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=60&h=60&fit=crop';

const emptyProduct = {
  name:'', category:'Black Tea', origin:'', description:'',
  flavor:[], qualities:'Standard', caffeine:'Medium Caffeine',
  allergens:[], isOrganic:false, isVegan:false,
  ingredients:'', steepeingInstructions:{ servingSize:'', waterTemp:'', steepingTime:'', colorAfter:'' },
  variants:[{ weight:'50g', price:'', stock:'' }],
};

export default function AdminProducts() {
  const [products, setProducts]   = useState([]);
  const [pagination, setPagination] = useState({ page:1, totalPages:1, total:0 });
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(null); // null | 'create' | 'edit'
  const [editProduct, setEditProduct] = useState(emptyProduct);
  const [deleteId, setDeleteId]   = useState(null);
  const [saving, setSaving]       = useState(false);
  const [page, setPage]           = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products?page=${page}&limit=10`);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openCreate = () => { setEditProduct(emptyProduct); setModal('create'); };
  const openEdit   = (p) => {
    setEditProduct({
      ...p,
      flavor: p.flavor || [],
      allergens: p.allergens || [],
      steepeingInstructions: p.steepeingInstructions || { servingSize:'', waterTemp:'', steepingTime:'', colorAfter:'' },
      variants: p.variants?.length ? p.variants.map(v => ({ ...v, price: String(v.price), stock: String(v.stock) })) : [{ weight:'50g', price:'', stock:'' }],
    });
    setModal('edit');
  };

  const handleSave = async () => {
    if (!editProduct.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const payload = {
        ...editProduct,
        variants: editProduct.variants.map(v => ({ ...v, price: parseFloat(v.price), stock: parseInt(v.stock) })),
      };
      if (modal === 'create') await api.post('/products', payload);
      else await api.put(`/products/${editProduct._id}`, payload);
      toast.success(modal === 'create' ? 'Product created!' : 'Product updated!');
      setModal(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${deleteId}`);
      toast.success('Product deleted');
      setDeleteId(null);
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  const F = ({ label, children }) => (
    <div className="mb-4">
      <label className="label-sm block mb-1">{label}</label>
      {children}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-sans text-[#8a8a8a]">{pagination.total} products</span>
        <button onClick={openCreate} className="btn-dark">+ Add Product</button>
      </div>

      {/* Table */}
      {loading ? <Spinner /> : (
        <div className="bg-white border border-[#e0ddd8]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f5f5f3]">
                {['','Name','Category','Variants','Stock','Price','Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[2px] uppercase font-sans text-[#8a8a8a] font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => {
                const imgSrc = p.images?.[0]
                  ? (p.images[0].startsWith('http') ? p.images[0] : `http://localhost:5000${p.images[0]}`)
                  : FALLBACK;
                const minPrice = p.variants?.length ? Math.min(...p.variants.map(v => v.price)) : 0;
                const totalStock = p.variants?.reduce((s, v) => s + v.stock, 0) || 0;
                return (
                  <tr key={p._id} className="border-b border-[#f5f5f3] hover:bg-[#fafaf9] transition-colors">
                    {/* Image */}
                    <td className="px-5 py-3">
                      <div className="w-10 h-10 bg-[#eeede9] border border-[#e0ddd8] overflow-hidden flex-shrink-0">
                        <img src={imgSrc} alt={p.name}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.onerror = null; e.target.src = FALLBACK; }} />
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs font-sans text-[#1a1a1a] max-w-[180px]">
                      <p className="truncate font-medium">{p.name}</p>
                      {p.isOrganic && <span className="text-[9px] text-green-600">Organic</span>}
                    </td>
                    <td className="px-5 py-3 text-[10px] font-sans text-[#4a4a4a] uppercase tracking-wide">{p.category}</td>
                    <td className="px-5 py-3 text-xs font-sans text-[#4a4a4a]">{p.variants?.length || 0}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-sans font-medium ${totalStock < 10 ? 'text-red-600' : 'text-[#1a1a1a]'}`}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs font-sans font-medium text-[#1a1a1a]">€{minPrice.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)}
                          className="text-[10px] tracking-[1px] uppercase font-sans px-3 py-1.5 border border-[#e0ddd8] bg-white text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer">
                          Edit
                        </button>
                        <button onClick={() => setDeleteId(p._id)}
                          className="text-[10px] tracking-[1px] uppercase font-sans px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="p-4">
            <Pagination page={page} totalPages={pagination.totalPages} onChange={setPage} />
          </div>
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-7 py-5 border-b border-[#e0ddd8] sticky top-0 bg-white z-10">
              <h3 className="font-serif text-[20px] font-light text-[#1a1a1a]">
                {modal === 'create' ? 'Add New Product' : 'Edit Product'}
              </h3>
              <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[#8a8a8a] hover:text-[#1a1a1a] text-xl leading-none">×</button>
            </div>

            <div className="px-7 py-6">
              {/* Name */}
              <F label="Product Name *">
                <input className="input-field" value={editProduct.name}
                  onChange={e => setEditProduct(p => ({ ...p, name: e.target.value }))} />
              </F>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <F label="Category">
                  <select className="input-field cursor-pointer" value={editProduct.category}
                    onChange={e => setEditProduct(p => ({ ...p, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </F>
                {/* Origin */}
                <F label="Origin">
                  <input className="input-field" value={editProduct.origin}
                    onChange={e => setEditProduct(p => ({ ...p, origin: e.target.value }))} />
                </F>
              </div>

              {/* Description */}
              <F label="Description">
                <textarea className="input-field resize-none" rows={3} value={editProduct.description}
                  onChange={e => setEditProduct(p => ({ ...p, description: e.target.value }))} />
              </F>

              <div className="grid grid-cols-2 gap-4">
                <F label="Qualities">
                  <select className="input-field cursor-pointer" value={editProduct.qualities}
                    onChange={e => setEditProduct(p => ({ ...p, qualities: e.target.value }))}>
                    {['Standard','Premium','Luxury'].map(q => <option key={q}>{q}</option>)}
                  </select>
                </F>
                <F label="Caffeine">
                  <select className="input-field cursor-pointer" value={editProduct.caffeine}
                    onChange={e => setEditProduct(p => ({ ...p, caffeine: e.target.value }))}>
                    {['No Caffeine','Low Caffeine','Medium Caffeine','High Caffeine'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </F>
              </div>

              {/* Flavors */}
              <F label="Flavors (comma separated)">
                <input className="input-field" value={editProduct.flavor?.join(', ')}
                  onChange={e => setEditProduct(p => ({ ...p, flavor: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} />
              </F>

              {/* Organic / Vegan */}
              <div className="flex gap-6 mb-5">
                {[['isOrganic','Organic'],['isVegan','Vegan']].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editProduct[key]}
                      onChange={e => setEditProduct(p => ({ ...p, [key]: e.target.checked }))}
                      className="w-3.5 h-3.5 accent-[#1a1a1a]" />
                    <span className="text-xs font-sans text-[#1a1a1a]">{label}</span>
                  </label>
                ))}
              </div>

              {/* Ingredients */}
              <F label="Ingredients">
                <input className="input-field" value={editProduct.ingredients}
                  onChange={e => setEditProduct(p => ({ ...p, ingredients: e.target.value }))} />
              </F>

              {/* Steeping Instructions */}
              <div className="mb-5">
                <p className="label-sm block mb-3">Steeping Instructions</p>
                <div className="grid grid-cols-2 gap-3">
                  {[['servingSize','Serving Size'],['waterTemp','Water Temp'],['steepingTime','Steeping Time'],['colorAfter','Color After']].map(([k,l]) => (
                    <div key={k}>
                      <label className="label-sm block mb-1">{l}</label>
                      <input className="input-field" value={editProduct.steepeingInstructions?.[k] || ''}
                        onChange={e => setEditProduct(p => ({ ...p, steepeingInstructions: { ...p.steepeingInstructions, [k]: e.target.value } }))} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Variants */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="label-sm">Variants</p>
                  <button onClick={() => setEditProduct(p => ({ ...p, variants: [...p.variants, { weight:'', price:'', stock:'' }] }))}
                    className="text-[10px] font-sans text-[#4a4a4a] hover:text-[#1a1a1a] bg-transparent border-none cursor-pointer underline">
                    + Add Variant
                  </button>
                </div>
                <div className="space-y-2">
                  {editProduct.variants?.map((v, i) => (
                    <div key={i} className="grid grid-cols-[2fr_2fr_2fr_auto] gap-2 items-center">
                      {[['weight','Weight e.g. 50g'],['price','Price €'],['stock','Stock']].map(([k,ph]) => (
                        <input key={k} className="input-field text-xs" placeholder={ph} value={v[k]}
                          onChange={e => {
                            const vv = [...editProduct.variants];
                            vv[i] = { ...vv[i], [k]: e.target.value };
                            setEditProduct(p => ({ ...p, variants: vv }));
                          }} />
                      ))}
                      <button onClick={() => setEditProduct(p => ({ ...p, variants: p.variants.filter((_,j) => j !== i) }))}
                        className="text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer text-lg leading-none">×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-7 py-5 border-t border-[#e0ddd8] sticky bottom-0 bg-white">
              <button onClick={() => setModal(null)} className="btn-outline">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-dark"
                style={{ opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : modal === 'create' ? 'Create Product' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 max-w-sm w-full">
            <h3 className="font-serif text-[22px] font-light mb-3 text-[#1a1a1a]">Delete Product</h3>
            <p className="text-sm font-sans text-[#4a4a4a] mb-6">Are you sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-outline">Cancel</button>
              <button onClick={handleDelete}
                className="px-7 py-3 text-[11px] tracking-[2px] uppercase font-sans bg-red-600 text-white border-none cursor-pointer hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
