import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import SearchBar from './SearchBar';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Articles', path: '/articles' },
  { label: 'Interviews', path: '/interviews' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact Us', path: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[90px] bg-white shadow-nav">
      <div className="container-site h-full grid grid-cols-1 nav:grid-cols-[1fr_auto_1fr] items-center">
        {/* Left: Logo (+ hamburger on mobile) */}
        <div className="flex items-center justify-between nav:justify-start gap-4">
          <Link to="/" className="flex items-center shrink-0">
            <img src="/logo-hindi.png" alt="रविवार" className="h-[63.25px] w-auto" />
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="nav:hidden rounded-lg p-3 text-ink-secondary hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Center: Desktop Navigation (truly centered via 3-column grid) */}
        <nav className="hidden nav:flex items-center justify-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'nav-link',
                location.pathname === item.path && 'text-primary-500'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Desktop Search */}
        <div className="hidden nav:flex justify-end shrink-0 translate-x-[20%]">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Menu (trimmed links) */}
      {mobileOpen && (
        <div className="nav:hidden fixed inset-0 top-[90px] bg-white z-40 animate-fade-in">
          <nav className="container-site py-8 flex flex-col gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'text-xl font-medium text-ink-primary hover:text-primary-500 transition-colors',
                  location.pathname === item.path && 'text-primary-500'
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100">
              <SearchBar />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
