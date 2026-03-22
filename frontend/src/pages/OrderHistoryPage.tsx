import { useEffect, useState } from 'react';
import { api, Order } from '../api';
import { useCart } from '../context/CartContext';

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-yellow-100 text-yellow-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};

export default function OrderHistoryPage() {
  const { sessionId } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => { api.getMyOrders(sessionId).then(setOrders); }, [sessionId]);

  if (!orders.length) return <div className="p-6 text-center text-gray-500">No orders yet.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.slice().reverse().map(o => (
          <div key={o.id} className="border rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">#{o.id}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[o.status] ?? 'bg-gray-100 text-gray-600'}`}>{o.status}</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">{new Date(o.createdAt).toLocaleString()}</p>
            {o.items.map(i => (
              <div key={i.productId} className="flex justify-between text-sm py-0.5">
                <span>{i.name} × {i.quantity}</span>
                <span>R{(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t mt-2 pt-2 font-bold flex justify-between">
              <span>Total</span><span className="text-indigo-600">R{o.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
