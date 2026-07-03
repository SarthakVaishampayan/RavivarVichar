import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '../components/layout/PageLayout';
import FloatingDots from '../components/shared/FloatingDots';
import Button from '../components/shared/Button';
import api from '../lib/axios';
import { UserPlus, Check, Loader2, Send } from 'lucide-react';

export default function Membership() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', membershipType: 'Individual' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError('Name and email are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/membership', form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <Helmet>
        <title>Become a Member — RavivarVichar</title>
        <meta name="description" content="Join RavivarVichar as a member and become part of our community driving rural development." />
      </Helmet>

      <section className="relative overflow-hidden bg-surface-secondary py-24 lg:py-32">
        <FloatingDots />
        <div className="container-content relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="section-label">MEMBERSHIP</span>
            <h1 className="text-hero-mobile lg:text-hero text-ink-primary mt-4 leading-tight">
              Become a{' '}
              <span className="text-primary-500">Member</span>
            </h1>
            <p className="text-body text-ink-secondary mt-6 max-w-2xl mx-auto">
              Join our community of change-makers. Members gain access to research publications, program updates, and opportunities to collaborate on ground-level projects.
            </p>
          </div>
        </div>
      </section>

      <section className="section-md bg-surface-white">
        <div className="container-content max-w-2xl mx-auto">
          {submitted ? (
            <div className="card p-12 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 mb-6">
                <Check size={32} />
              </div>
              <h2 className="text-2xl font-heading font-bold text-ink-primary mb-3">Welcome to RavivarVichar!</h2>
              <p className="text-body text-ink-secondary mb-6">Your membership application has been submitted. We'll be in touch with you shortly.</p>
              <Button variant="primary" to="/">Back to Home</Button>
            </div>
          ) : (
            <div className="card p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">Full Name *</label>
                  <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="input-field" placeholder="Your full name" required />
                </div>
                <div>
                  <label className="label">Email Address *</label>
                  <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} className="input-field" placeholder="you@example.com" required />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className="input-field" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="label">Membership Type</label>
                  <select value={form.membershipType} onChange={(e) => handleChange('membershipType', e.target.value)} className="input-field">
                    <option value="Individual">Individual</option>
                    <option value="Student">Student</option>
                    <option value="Professional">Professional</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Volunteer">Volunteer</option>
                  </select>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" variant="primary" className="w-full justify-center" disabled={loading}>
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
