import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { api, Order } from '../api';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const { items, total, sessionId, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '' });
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!items.length && !order) { navigate('/cart'); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await api.checkout(
      sessionId,
      items.map(i => ({ productId: i.id, quantity: i.quantity })),
      form
    );
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    clear();
    setOrder(result);
  };

  if (order) return (
    <div className="p-6 max-w-lg mx-auto text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 mb-1">Order #{order.id}</p>
      <p className="text-indigo-600 font-bold text-xl mb-6">Total: R{order.total.toFixed(2)}</p>
      <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
        {order.items.map(i => (
          <div key={i.productId} className="flex justify-between py-1 text-sm">
            <span>{i.name} × {i.quantity}</span>
            <span>R{(i.price * i.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg">Continue Shopping</button>
    </div>
  );

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        {items.map(i => (
          <div key={i.id} className="flex justify-between text-sm py-1">
            <span>{i.name} × {i.quantity}</span>
            <span>R{(i.price * i.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t mt-2 pt-2 font-bold flex justify-between">
          <span>Total</span><span>R{total.toFixed(2)}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        {(['name', 'email', 'address', 'city', 'zip'] as const).map(f => (
          <input key={f} required placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
            value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        ))}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Placing order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
