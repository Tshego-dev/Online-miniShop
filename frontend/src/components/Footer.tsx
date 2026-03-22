import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white mt-12">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🛍️</span>
            <span className="text-lg font-extrabold tracking-tight">ShopMini</span>
          </div>
          <p className="text-indigo-200 text-sm leading-relaxed">
            Your one-stop mini shop for quality products across all categories. Fast, simple, and reliable.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <p className="font-semibold mb-3 text-sm uppercase tracking-wide">Quick Links</p>
          <ul className="space-y-2 text-sm text-indigo-200">
            {[['/', 'Products'], ['/categories', 'Categories'], ['/search', 'Search'], ['/orders', 'My Orders']].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-white transition">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="font-semibold mb-3 text-sm uppercase tracking-wide">Get In Touch</p>
          <ul className="space-y-2 text-sm text-indigo-200">
            <li className="flex items-center gap-2">
              <span>📧</span>
              <a href="mailto:support@shopmini.co.za" className="hover:text-white transition">tlhoditshego10@gmail.com</a>
            </li>
            <li className="flex items-center gap-2">
              <span>📞</span>
              <a href="tel:+27110000000" className="hover:text-white transition">+27 68 530 9332</a>
            </li>
            <li className="flex items-center gap-2">
              <span>📍</span>
              <span>East London, South Africa</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-indigo-500 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-indigo-300 max-w-6xl mx-auto">
        <span>© {new Date().getFullYear()} ShopMini. All rights reserved.</span>
        <span>
          Built with ❤️ by <span className="text-white font-semibold">Tshego</span>
        </span>
      </div>
    </footer>
  );
}
