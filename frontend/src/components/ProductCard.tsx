import { Product } from '../api';
import { useCart } from '../context/CartContext';

export default function ProductCard({ p }: { p: Product }) {
  const { add, items } = useCart();
  const inCart = items.find(i => i.id === p.id)?.quantity ?? 0;
  return (
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition bg-white">
      <img src={p.image} alt={p.name} className="w-full h-44 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h2 className="font-semibold text-sm leading-snug">{p.name}</h2>
          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
            p.stock === 0 ? 'bg-red-100 text-red-600' : p.stock < 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
          }`}>
            {p.stock === 0 ? 'Out' : p.stock < 5 ? 'Low' : 'In stock'}
          </span>
        </div>
        <p className="text-gray-400 text-xs mb-3">{p.category}</p>
        <div className="flex items-center justify-between">
          <span className="text-indigo-600 font-bold text-base">R{p.price.toFixed(2)}</span>
          <button
            disabled={p.stock === 0 || inCart >= p.stock}
            onClick={() => add(p)}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm disabled:opacity-40 hover:bg-indigo-700"
          >
            {inCart > 0 ? `In cart (${inCart})` : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
