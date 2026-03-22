import { useEffect, useState, useMemo } from 'react';
import { api, Product, Order } from '../api';

const STATUS_OPTIONS = ['confirmed', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-yellow-100 text-yellow-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function Dashboard({ orders, products }: { orders: Order[]; products: Product[] }) {
  const revenue = useMemo(() => orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0), [orders]);
  const todayRevenue = useMemo(() => {
    const today = new Date().toDateString();
    return orders.filter(o => o.status !== 'cancelled' && new Date(o.createdAt).toDateString() === today).reduce((s, o) => s + o.total, 0);
  }, [orders]);

  const statusCounts = useMemo(() => orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1; return acc;
  }, {}), [orders]);

  // Last 7 days daily revenue
  const dailyRevenue = useMemo(() => {
    const days: { label: string; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-ZA', { weekday: 'short' });
      const total = orders
        .filter(o => o.status !== 'cancelled' && new Date(o.createdAt).toDateString() === d.toDateString())
        .reduce((s, o) => s + o.total, 0);
      days.push({ label, total });
    }
    return days;
  }, [orders]);

  const maxDay = Math.max(...dailyRevenue.map(d => d.total), 1);

  // Top products by revenue
  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; revenue: number; qty: number }> = {};
    orders.filter(o => o.status !== 'cancelled').forEach(o =>
      o.items.forEach(i => {
        if (!map[i.productId]) map[i.productId] = { name: i.name, revenue: 0, qty: 0 };
        map[i.productId].revenue += i.price * i.quantity;
        map[i.productId].qty += i.quantity;
      })
    );
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [orders]);

  const lowStock = products.filter(p => p.stock > 0 && p.stock < 5);
  const outOfStock = products.filter(p => p.stock === 0);

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`R${revenue.toFixed(2)}`} sub="excl. cancelled" />
        <StatCard label="Today's Revenue" value={`R${todayRevenue.toFixed(2)}`} />
        <StatCard label="Total Orders" value={String(orders.length)} sub={`${statusCounts['delivered'] ?? 0} delivered`} />
        <StatCard label="Products" value={String(products.length)} sub={`${outOfStock.length} out of stock`} />
      </div>

      {/* Revenue bar chart — last 7 days */}
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <p className="text-sm font-semibold mb-4">Revenue — Last 7 Days</p>
        <div className="flex items-end gap-2 h-32">
          {dailyRevenue.map(d => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400">{d.total > 0 ? `R${d.total.toFixed(0)}` : ''}</span>
              <div className="w-full bg-indigo-500 rounded-t transition-all"
                style={{ height: `${(d.total / maxDay) * 96}px`, minHeight: d.total > 0 ? '4px' : '0' }} />
              <span className="text-xs text-gray-500">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Order status breakdown */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-sm font-semibold mb-3">Orders by Status</p>
          <div className="space-y-2">
            {STATUS_OPTIONS.map(s => {
              const count = statusCounts[s] ?? 0;
              const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
              return (
                <div key={s}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[s]}`}>{s}</span>
                    <span className="text-gray-500">{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full">
                    <div className="h-1.5 bg-indigo-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-sm font-semibold mb-3">Top Products by Revenue</p>
          {topProducts.length === 0
            ? <p className="text-xs text-gray-400">No sales yet.</p>
            : <div className="space-y-2">
                {topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                      <span className="font-medium">{p.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-indigo-600 font-semibold">R{p.revenue.toFixed(2)}</span>
                      <span className="text-xs text-gray-400 ml-2">{p.qty} sold</span>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      {/* Stock alerts */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-sm font-semibold mb-3">⚠️ Stock Alerts</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {outOfStock.map(p => (
              <div key={p.id} className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs">
                <p className="font-medium text-red-700">{p.name}</p>
                <p className="text-red-400">Out of stock</p>
              </div>
            ))}
            {lowStock.map(p => (
              <div key={p.id} className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-xs">
                <p className="font-medium text-yellow-700">{p.name}</p>
                <p className="text-yellow-500">{p.stock} left</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '', image: '' });
  const [stockEdits, setStockEdits] = useState<Record<string, string>>({});

  const loadAll = () => {
    api.getProducts().then(setProducts);
    api.getAllOrders().then(o => setOrders(o.slice().reverse()));
  };

  useEffect(loadAll, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.addProduct({ name: newProduct.name, price: +newProduct.price, stock: +newProduct.stock, category: newProduct.category, image: newProduct.image });
    setNewProduct({ name: '', price: '', stock: '', category: '', image: '' });
    loadAll();
  };

  const handleStockUpdate = async (id: string) => {
    await api.updateStock(id, +stockEdits[id]);
    loadAll();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await api.deleteProduct(id);
    loadAll();
  };

  const handleStatusChange = async (id: string, status: string) => {
    await api.updateOrderStatus(id, status);
    loadAll();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="flex gap-2 mb-6">
        {(['dashboard', 'products', 'orders'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize ${tab === t ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
            {t === 'dashboard' ? '📊 Dashboard' : t === 'products' ? '📦 Products' : '🧾 Orders'}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && <Dashboard orders={orders} products={products} />}

      {tab === 'products' && (
        <>
          <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-3 mb-8 bg-gray-50 p-4 rounded-xl">
            <h2 className="col-span-2 font-semibold">Add New Product</h2>
            {(['name', 'price', 'stock', 'category', 'image'] as const).map(f => (
              <input key={f} required={f !== 'image'} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                value={newProduct[f]} onChange={e => setNewProduct(p => ({ ...p, [f]: e.target.value }))}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            ))}
            <button type="submit" className="col-span-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm">Add Product</button>
          </form>
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-gray-100 text-left">
              {['Product', 'Category', 'Price', 'Stock', 'Update Stock', ''].map(h => <th key={h} className="px-3 py-2">{h}</th>)}
            </tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{p.name}</td>
                  <td className="px-3 py-2 text-gray-500">{p.category}</td>
                  <td className="px-3 py-2">R{p.price.toFixed(2)}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.stock === 0 ? 'bg-red-100 text-red-600' : p.stock < 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <input type="number" min="0" placeholder={String(p.stock)}
                        value={stockEdits[p.id] ?? ''}
                        onChange={e => setStockEdits(s => ({ ...s, [p.id]: e.target.value }))}
                        className="w-16 border rounded px-2 py-1 text-xs" />
                      <button onClick={() => handleStockUpdate(p.id)} disabled={!stockEdits[p.id]}
                        className="bg-indigo-600 text-white px-2 py-1 rounded text-xs disabled:opacity-40 hover:bg-indigo-700">Save</button>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === 'orders' && (
        <div className="space-y-4">
          {!orders.length && <p className="text-gray-500">No orders yet.</p>}
          {orders.map(o => (
            <div key={o.id} className="border rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-mono text-xs text-gray-400">#{o.id}</span>
                  <span className="ml-3 text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</span>
                </div>
                <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <p className="text-sm text-gray-500 mb-1">
                {o.shippingInfo.name} · {o.shippingInfo.email} · {o.shippingInfo.city}
              </p>
              {o.items.map(i => (
                <div key={i.productId} className="flex justify-between text-sm py-0.5">
                  <span>{i.name} × {i.quantity}</span>
                  <span>R{(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t mt-2 pt-2 font-bold flex justify-between text-sm">
                <span>Total</span><span className="text-indigo-600">R{o.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}