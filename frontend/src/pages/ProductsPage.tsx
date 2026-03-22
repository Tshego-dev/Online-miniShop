import { useEffect, useState } from 'react';
import { api, Product } from '../api';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => { api.getProducts().then(setProducts); }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {products.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
