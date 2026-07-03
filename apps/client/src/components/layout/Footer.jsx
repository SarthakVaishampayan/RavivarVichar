import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight, Check, Loader2 } from 'lucide-react';
import api from '../../lib/axios';

const footerLinks = {
  'Quick Links': [
    { label: 'Programs', path: '/programs' },
    { label: 'About Us', path: '/about' },
    { label: 'Knowledge Hub', path: '/knowledge-hub' },
    { label: 'Events', path: '/events' },
    { label: 'Contact', path: '/contact' },
  ],
  'Programs': [
    { label: 'Women Entrepreneurs', path: '/programs/women-entrepreneurs' },
    { label: 'SHG Development', path: '/programs/shg-development' },
    { label: 'Financial Literacy', path: '/programs/financial-literacy' },
  ],
  'Resources': [
    { label: 'Research Reports', path: '/research' },
    { label: 'Case Studies', path: '/knowledge-hub?category=Case+Study' },
    { label: 'Gallery', path: '/media' },
    { label: 'Press Releases', path: '/media?type=press-release' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      await api.post('/newsletter/subscribe', { email });
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-surface-secondary border-t border-gray-100">
      <div className="container-site py-20">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-lg font-bold text-white">
                R
              </div>
              <span className="text-lg font-bold font-heading text-ink-primary">
                RavivarVichar
              </span>
            </Link>
            <p className="text-body text-ink-secondary mb-6 max-w-sm">
              Empowering rural communities through research, entrepreneurship, and self-help groups. Working towards sustainable development across Rajasthan.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 text-ink-secondary hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all duration-300"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold text-ink-primary uppercase tracking-wider mb-5">
                {heading}
              </h4>
              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-body text-ink-secondary hover:text-primary-500 transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-card font-heading font-bold text-ink-primary mb-3">
              Stay Connected
            </h3>
            <p className="text-body text-ink-secondary mb-6">
              Subscribe to our newsletter for updates on programs, research, and impact stories.
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input-field flex-1"
                required
              />
              <button type="submit" disabled={loading || subscribed} className="btn-primary shrink-0">
                {loading ? <Loader2 size={18} className="animate-spin" /> : subscribed ? <Check size={18} /> : <><span>Subscribe</span> <ArrowRight size={18} /></>}
              </button>
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            {subscribed && <p className="text-xs text-green-600 mt-2">Thank you for subscribing!</p>}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="container-site py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink-secondary">
            © {new Date().getFullYear()} RavivarVichar. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-ink-secondary">
            <Link to="/privacy" className="hover:text-primary-500 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-500 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
