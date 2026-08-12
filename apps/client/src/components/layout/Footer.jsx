import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowRight, Check, Loader2 } from 'lucide-react';
import api from '../../lib/axios';

const footerLinks = {
  'Quick Links': [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Articles', path: '/articles' },
    { label: 'Interviews', path: '/interviews' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact Us', path: '/contact' },
  ],
  'Articles': [
    { label: 'Articles', path: '/articles#articles' },
    { label: 'Research & Reports', path: '/articles#research-reports' },
    { label: 'Success Stories', path: '/articles#success-stories' },
  ],
  'Interviews': [
    { label: 'Interviews', path: '/interviews#interviews' },
    { label: 'Podcasts', path: '/interviews#podcasts' },
  ],
  'About Us': [
    { label: 'Our Story', path: '/about#our-story' },
    { label: 'Our Vision', path: '/about#our-vision' },
    { label: 'Our Mission', path: '/about#our-mission' },
    { label: 'Our Goals', path: '/about#our-goals' },
    { label: 'Our Journey', path: '/about#our-journey' },
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


// Right-shift percentages for the link columns (desktop only)
const linkColumnMargins = {
  'Quick Links': 'lg:ml-[25%]',
  'Articles': 'lg:ml-[25%]',
  'Interviews': 'lg:ml-[15%]',
};

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
    <footer className="bg-surface-secondary border-t border-gray-300 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400" />
      <div className="container-site pt-12 pb-2">
        <div className="grid grid-cols-1 min-[550px]:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-6">
          {/* Newsletter + Social Column */}
          <div className="lg:col-span-2 max-lg:text-center">
            <h3 className="text-[21px] font-heading font-bold text-ink-primary mb-4">
              Stay Connected
            </h3>

            {/* Social Icons — on their own line below the heading */}
            <div className="flex items-center max-lg:justify-center gap-2 mb-5">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-200 text-ink-secondary hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all duration-300"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>

            <p className="text-[14px] leading-relaxed text-ink-secondary mb-4">
              Subscribe to our newsletter for updates on programs, research, and impact stories.
            </p>

            <form onSubmit={handleNewsletter} className="max-lg:flex-col max-lg:mx-auto flex gap-3 max-w-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input-field flex-1 !text-[14px]"
                required
              />
              <button type="submit" disabled={loading || subscribed} className="btn-primary shrink-0 !text-[11px]">
                {loading ? <Loader2 size={18} className="animate-spin" /> : subscribed ? <Check size={18} /> : <><span>Subscribe</span> <ArrowRight size={18} /></>}
              </button>
            </form>
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            {subscribed && <p className="text-xs text-green-600 mt-2">Thank you for subscribing!</p>}
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div
              key={heading}
              className={[
                linkColumnMargins[heading] || '',
                // Keep only Quick Links visible below 1150px; hide the rest
                heading !== 'Quick Links' ? 'max-lg:hidden' : '',
                'max-lg:text-center',
              ].join(' ').trim()}
            >
              <h4 className="text-sm font-semibold text-ink-primary uppercase tracking-wider mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
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
        <div className="container-site pt-1 pb-4 text-center">
          <p className="text-sm text-ink-primary">
            <span className="inline-block bg-secondary-100 text-ink-primary font-medium px-4 py-1 rounded-md shadow-sm">
              Designed &amp; Developed by <span className="font-semibold">Sarthak Vaishampayan</span>{' '}
              <span className="mx-1 opacity-50">|</span>
              © {new Date().getFullYear()} Ravivar Vichar. All rights reserved.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
