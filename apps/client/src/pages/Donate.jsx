import { Helmet } from 'react-helmet-async';
import PageLayout from '../components/layout/PageLayout';
import SectionHeading from '../components/shared/SectionHeading';
import FloatingDots from '../components/shared/FloatingDots';
import Button from '../components/shared/Button';
import api from '../lib/axios';
import { Heart, Shield, TrendingUp, Users, BookOpen, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';

const tiers = [
  { amount: '₹500', title: 'Supporter', description: 'Provides training materials for one rural woman entrepreneur.', popular: false },
  { amount: '₹2,000', title: 'Champion', description: 'Funds a complete financial literacy workshop for 20 women.', popular: true },
  { amount: '₹5,000', title: 'Changemaker', description: 'Supports an SHG with seed capital and training for one year.', popular: false },
  { amount: '₹10,000', title: 'Community Builder', description: 'Funds a health camp reaching 200+ villagers.', popular: false },
];

const impactItems = [
  { icon: Users, stat: '50+', label: 'Villages Supported Per Month' },
  { icon: BookOpen, stat: '10K+', label: 'People Trained This Year' },
  { icon: Heart, stat: '85%', label: 'Goes Directly to Programs' },
  { icon: TrendingUp, stat: '40%', label: 'Average Income Increase' },
];

export default function Donate() {
  const [selected, setSelected] = useState(1);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [donated, setDonated] = useState(false);
  const [error, setError] = useState('');

  const handleDonate = async () => {
    if (!name || !email) {
      setError('Please enter your name and email to proceed.');
      return;
    }
    const amount = customAmount || tiers[selected]?.amount.replace('₹', '').replace(',', '') || 500;
    setLoading(true);
    setError('');
    try {
      await api.post('/donations', { donorName: name, email, amount: Number(amount), purpose: tiers[selected]?.title || 'General donation' });
      setDonated(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Donation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Donate — RavivarVichar</title>
        <meta name="description" content="Support RavivarVichar's mission to empower rural communities. Your donation helps fund entrepreneurship, education, and health programs." />
      </Helmet>

      <PageLayout>
        {/* Hero */}
        <section className="relative overflow-hidden bg-primary-500 py-24 lg:py-32">
          <FloatingDots />
          <div className="container-content relative z-10 text-center">
            <span className="text-sm font-semibold uppercase tracking-[2px] text-white/80">SUPPORT OUR MISSION</span>
            <h1 className="text-hero-mobile lg:text-hero text-white mt-4 leading-tight">
              Make a{' '}
              <span className="text-white underline decoration-white/30">Difference</span>
            </h1>
            <p className="text-lg text-white/80 mt-6 max-w-2xl mx-auto">
              Your donation empowers rural communities with the tools, training, and resources they need 
              to build sustainable livelihoods and a better future.
            </p>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="section-sm bg-surface-white border-b border-gray-100">
          <div className="container-content">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {impactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="text-center">
                    <Icon size={28} className="mx-auto text-primary-500 mb-2" />
                    <div className="text-2xl lg:text-3xl font-bold font-heading text-ink-primary">{item.stat}</div>
                    <div className="text-sm text-ink-secondary mt-1">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Donation Tiers */}
        <section className="section-md bg-surface-white">
          <div className="container-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left: Tiers */}
              <div>
                <span className="section-label">CHOOSE AMOUNT</span>
                <h2 className="text-section-mobile lg:text-section text-ink-primary font-heading font-bold mt-3">
                  Select Your Donation
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  {tiers.map((tier, i) => (
                    <button
                      key={tier.amount}
                      onClick={() => { setSelected(i); setCustomAmount(''); }}
                      className={`relative p-6 rounded-card border-2 text-left transition-all duration-300 ${
                        selected === i && !customAmount
                          ? 'border-primary-500 bg-primary-50 shadow-soft'
                          : 'border-gray-200 hover:border-primary-300 bg-white'
                      }`}
                    >
                      {tier.popular && (
                        <span className="absolute -top-3 left-4 text-xs font-bold px-3 py-1 rounded-full bg-primary-500 text-white">
                          Most Popular
                        </span>
                      )}
                      <div className="text-2xl font-bold font-heading text-ink-primary">{tier.amount}</div>
                      <div className="text-sm font-semibold text-ink-primary mt-1">{tier.title}</div>
                      <div className="text-sm text-ink-secondary mt-2">{tier.description}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-6">
                  <label className="label">Or enter a custom amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-ink-primary">₹</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); setSelected(-1); }}
                      placeholder="Enter amount"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Why Donate */}
              <div className="card p-8 lg:p-10 bg-surface-section border-0">
                {/* Donor Info */}
                <div className="mb-6 space-y-4">
                  <h3 className="text-card font-heading font-bold text-ink-primary">Your Information</h3>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name *" className="input-field" required />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email *" className="input-field" required />
                </div>
                <h3 className="text-card font-heading font-bold text-ink-primary mb-6">Why Donate to RavivarVichar?</h3>
                <div className="space-y-4">
                  {[
                    '85% of donations go directly to program activities',
                    'Transparent reporting with annual impact assessments',
                    '80+ villages reached through community-driven programs',
                    'Tax-exempt under 80G of IT Act',
                    'Quarterly updates on your donation\'s impact',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <Check size={18} className="shrink-0 mt-0.5 text-secondary-500" />
                      <span className="text-body text-ink-primary">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  {donated ? (
                    <div className="text-center py-4">
                      <Check size={32} className="mx-auto text-green-500 mb-2" />
                      <p className="text-green-600 font-medium">Thank you for your generosity! Your donation has been recorded.</p>
                    </div>
                  ) : (
                    <>
                      <Button variant="primary" className="w-full justify-center" arrow onClick={handleDonate} disabled={loading}>
                        {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                        {loading ? 'Processing...' : `Donate ${customAmount ? `₹${customAmount}` : tiers[selected]?.amount || ''}`}
                      </Button>
                      {error && <p className="text-xs text-red-500 text-center mt-2">{error}</p>}
                      <p className="text-xs text-ink-secondary text-center mt-3">
                        Your donation will be recorded. Payment gateway integration coming soon.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Ways to Support */}
        <section className="section-md bg-surface-section">
          <div className="container-content">
            <SectionHeading
              label="OTHER WAYS"
              title="More Ways to Support"
              description="Not in a position to donate? There are many other ways to contribute to our mission."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                { icon: Users, title: 'Volunteer', description: 'Share your skills and time with rural communities through our volunteer programs.' },
                { icon: Heart, title: 'Fundraise', description: 'Start a fundraising campaign for your birthday, anniversary, or special occasion.' },
                { icon: Shield, title: 'Corporate Partner', description: 'Partner your organization with us for CSR initiatives and employee engagement.' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="card-hover p-8 text-center">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 mb-5">
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-ink-primary">{item.title}</h3>
                    <p className="text-body text-ink-secondary mt-3">{item.description}</p>
                    <Button variant="secondary" to="/contact" className="mt-5">Learn More</Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
