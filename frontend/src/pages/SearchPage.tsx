import { useEffect, useState, useMemo } from 'react';
import { api, Product } from '../api';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [category, setCategory] = useState(searchParams.get('cat') ?? '');
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => { api.getProducts().then(setProducts); }, []);

  const categories = useMemo(() => [...new Set(products.map(p => p.category).filter(Boolean))].sort(), [products]);

  const results = useMemo(() => products.filter(p => {
    const matchQ = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase());
    const matchCat = !category || p.category === category;
    const matchStock = !inStockOnly || p.stock > 0;
    return matchQ && matchCat && matchStock;
  }), [products, query, category, inStockOnly]);

  const handleQuery = (q: string) => {
    setQuery(q);
    setSearchParams(q ? { q } : {});
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Search</h1>

      {/* Search bar */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          autoFocus
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={e => handleQuery(e.target.value)}
          className="w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
        />
        {query && (
          <button onClick={() => handleQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => setInStockOnly(v => !v)}
          className={`px-3 py-1.5 rounded-lg text-sm border transition ${inStockOnly ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 hover:border-indigo-300'}`}>
          In Stock Only
        </button>
        {(query || category || inStockOnly) && (
          <button onClick={() => { setQuery(''); setCategory(''); setInStockOnly(false); setSearchParams({}); }}
            className="px-3 py-1.5 rounded-lg text-sm border bg-white text-red-500 hover:border-red-300">
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      <p className="text-sm text-gray-400 mb-3">{results.length} result{results.length !== 1 ? 's' : ''}</p>
      {results.length === 0
        ? <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-2">🔍</div>
            <p>No products found for "<span className="font-medium text-gray-600">{query}</span>"</p>
          </div>
        : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {results.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
      }
    </div>
  );
}
