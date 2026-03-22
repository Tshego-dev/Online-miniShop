import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';

export default function Navbar() {
  const { items } = useCart();
  const { isAdmin, logout } = useAdmin();
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const { pathname } = useLocation();

  const isAdminRoute = pathname.startsWith('/admin');

  const link = (to: string, label: string) => (
    <Link
      to={to}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
        pathname === to
          ? 'bg-white text-indigo-600 shadow'
          : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );

  if (isAdminRoute) return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-lg">
      <span className="text-xl font-extrabold tracking-tight flex items-center gap-1.5">
        <span className="text-2xl">⚙️</span> ShopMini Admin
      </span>
      {isAdmin && (
        <button onClick={logout} className="px-4 py-1.5 rounded-full text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-all">
          Logout
        </button>
      )}
    </nav>
  );

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 flex items-center justify-between shadow-lg">
      <Link to="/" className="text-xl font-extrabold tracking-tight flex items-center gap-1.5">
        <span className="text-2xl">🛍️</span> ShopMini
      </Link>
      <div className="flex items-center gap-2">
        {link('/', 'Products')}
        {link('/categories', 'Categories')}
        {link('/orders', 'My Orders')}
        <Link to="/search"
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            pathname === '/search' ? 'bg-white text-indigo-600 shadow' : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
          }`}>
          🔍
        </Link>
        <Link
          to="/cart"
          className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            pathname === '/cart'
              ? 'bg-white text-indigo-600 shadow'
              : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
          }`}
        >
          🛒 Cart
          {count > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {count}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
