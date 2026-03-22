import { useEffect, useState } from 'react';
import { api, Product } from '../api';
import ProductCard from '../components/ProductCard';
import { useNavigate, useParams } from 'react-router-dom';

const CATEGORY_ICONS: Record<string, string> = {
  Electronics: '🔌', Footwear: '👟', Kitchen: '🍳', Sports: '⚽', Home: '🏠', Accessories: '🎒',
};

export default function CategoriesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const { category } = useParams<{ category?: string }>(); 
  const selected = category ? decodeURIComponent(category) : null;

  useEffect(() => { api.getProducts().then(setProducts); }, []);

  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    const cat = p.category || 'Other';
    (acc[cat] ??= []).push(p);
    return acc;
  }, {});

  // Single category view
  if (selected) {
    const items = grouped[selected] ?? [];
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <button onClick={() => navigate('/categories')} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 mb-4">
          ← Back to Categories
        </button>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{CATEGORY_ICONS[selected] ?? '📦'}</span>
          <div>
            <h1 className="text-2xl font-bold">{selected}</h1>
            <p className="text-gray-400 text-sm">{items.length} product{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {items.length === 0
          ? <p className="text-gray-400">No products in this category.</p>
          : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {items.map(p => <ProductCard key={p.id} p={p} />)}
            </div>
        }
      </div>
    );
  }

  // All categories overview
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Categories</h1>
      <p className="text-gray-400 text-sm mb-6">{Object.keys(grouped).length} categories · {products.length} products</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {Object.entries(grouped).map(([cat, items]) => (
          <button key={cat} onClick={() => navigate(`/categories/${encodeURIComponent(cat)}`)}
            className="bg-white border rounded-xl p-4 text-center shadow-sm hover:shadow-md hover:border-indigo-400 hover:-translate-y-0.5 transition-all">
            <div className="text-3xl mb-2">{CATEGORY_ICONS[cat] ?? '📦'}</div>
            <p className="text-sm font-semibold">{cat}</p>
            <p className="text-xs text-gray-400 mt-0.5">{items.length} items</p>
          </button>
        ))}
      </div>
    </div>
  );
}
