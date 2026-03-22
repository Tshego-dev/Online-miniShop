import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { items, remove, setQty, total } = useCart();
  const navigate = useNavigate();

  if (!items.length) return (
    <div className="p-6 text-center text-gray-500">
      <p className="text-xl mb-4">Your cart is empty</p>
      <button onClick={() => navigate('/')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Browse Products</button>
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cart</h1>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 border rounded-xl p-4">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-indigo-600">R{item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100">−</button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button onClick={() => setQty(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100 disabled:opacity-40">+</button>
            </div>
            <p className="w-20 text-right font-medium">R{(item.price * item.quantity).toFixed(2)}</p>
            <button onClick={() => remove(item.id)} className="text-red-400 hover:text-red-600 text-lg">✕</button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <span className="text-xl font-bold">Total: R{total.toFixed(2)}</span>
        <button onClick={() => navigate('/checkout')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Checkout</button>
      </div>
    </div>
  );
}
