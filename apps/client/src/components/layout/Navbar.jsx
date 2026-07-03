import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import Button from '../shared/Button';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Programs', path: '/programs' },
  { label: 'About', path: '/about' },
  { label: 'Knowledge Hub', path: '/knowledge-hub' },
  { label: 'Events', path: '/events' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 h-[90px] transition-all duration-300',
        scrolled || !isHome
          ? 'bg-white shadow-nav'
          : 'bg-transparent'
      )}
    >
      <div className="container-site h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-lg font-bold text-white">
            R
          </div>
          <span className="hidden sm:block text-lg font-bold font-heading text-ink-primary">
            RavivarVichar
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
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
        <div className="hidden lg:block">
          <Button variant="primary" to="/donate" arrow>
            Donate Now
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden rounded-lg p-2 text-ink-secondary hover:bg-gray-100"
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
              <Button variant="primary" to="/donate" arrow className="w-full justify-center">
                Donate Now
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
