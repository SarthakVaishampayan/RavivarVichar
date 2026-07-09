import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowRight, Check, Loader2 } from 'lucide-react';
import api from '../../lib/axios';

const footerLinks = {
  'Quick Links': [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Knowledge Hub', path: '/knowledge-hub' },
    { label: 'Events', path: '/events' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact Us', path: '/contact' },
  ],
  'Knowledge Hub': [
    { label: 'Articles', path: '/knowledge-hub#articles' },
    { label: 'Research & Reports', path: '/knowledge-hub#research-reports' },
    { label: 'Success Stories', path: '/knowledge-hub#success-stories' },
    { label: 'Interviews', path: '/knowledge-hub#interviews' },
  ],
  'About Us': [
    { label: 'Our Story', path: '/about#our-story' },
    { label: 'Our Vision', path: '/about#our-vision' },
    { label: 'Our Values', path: '/about#our-values' },
    { label: 'Our Mission', path: '/about#our-mission' },
    { label: 'Our Journey', path: '/about#our-journey' },
    { label: 'Our Founders', path: '/about#our-founders' },
    { label: 'Our History', path: '/about#our-history' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com/ravivarvichar', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/RavivarVichar', label: 'Twitter' },
  { icon: Instagram, href: 'https://www.instagram.com/ravivarvichar', label: 'Instagram' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/94272369', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://www.youtube.com/@ravivarvichar', label: 'YouTube' },
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
          {/* Newsletter + Social Column */}
          <div className="lg:col-span-2">
            <h3 className="text-card font-heading font-bold text-ink-primary mb-3">
              Stay Connected
            </h3>
            <p className="text-body text-ink-secondary mb-6">
              Subscribe to our newsletter for updates on programs, research, and impact stories.
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-3 max-w-sm">
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
            </form>
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            {subscribed && <p className="text-xs text-green-600 mt-2">Thank you for subscribing!</p>}

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-8">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
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
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="container-site py-6 text-center">
          <p className="text-sm text-ink-secondary">
            © {new Date().getFullYear()} Ravivar Vichar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
