import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import Button from '../shared/Button';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Knowledge Hub', path: '/knowledge-hub' },
  { label: 'Events', path: '/events' },
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
      <div className="container-site h-full flex items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 shrink-0">
          <img
            src="/logo.png"
            alt="Ravivar Vichar"
            className="h-12 w-auto"
          />
          <span className="block text-lg font-bold font-heading text-ink-primary">
            Ravivar Vichar
          </span>
        </Link>

        {/* Desktop Navigation - centered */}
        <nav className="hidden lg:flex items-center justify-center flex-1 gap-8">
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

        {/* Desktop CTA */}
        <div className="hidden lg:block shrink-0">
          <Button variant="primary" to="/get-featured" arrow>
            Get Featured
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden ml-auto rounded-lg p-3 text-ink-secondary hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[90px] bg-white z-40 animate-fade-in">
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
              <Button variant="primary" to="/get-featured" arrow className="w-full justify-center">
                Get Featured
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
