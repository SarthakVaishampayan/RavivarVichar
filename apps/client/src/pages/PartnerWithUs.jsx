import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import FloatingDots from '../components/shared/FloatingDots';
import Button from '../components/shared/Button';
import api from '../lib/axios';
import { Check, Loader2, ArrowLeft, Mail, Handshake } from 'lucide-react';

export default function PartnerWithUs() {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phoneNo: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/partner-applications', formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Helmet><title>Partner With Us — RavivarVichar</title></Helmet>
        <PageLayout>
          <section className="section-md min-h-[60vh] flex items-center">
            <div className="container-content text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
                <Check size={32} />
              </div>
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-ink-primary">Thank You!</h1>
              <p className="text-body text-ink-secondary mt-4 max-w-lg mx-auto">
                Thank you for your interest in partnering with us! Our team will review your application and reach out shortly.
              </p>
              <Button variant="primary" to="/" className="mt-8">Back to Home</Button>
            </div>
          </section>
        </PageLayout>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Partner With Us — RavivarVichar</title>
        <meta name="description" content="Partner with RavivarVichar to empower rural communities through research, entrepreneurship, and self-help groups." />
      </Helmet>

      <PageLayout>
        <section className="relative overflow-hidden bg-surface-secondary py-24 lg:py-28">
          <FloatingDots />
          <div className="container-content relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-ink-secondary hover:text-primary-500 transition-colors mb-8">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <div className="max-w-3xl">
              <span className="section-label">PARTNER WITH US</span>
              <h1 className="text-hero-mobile lg:text-hero text-ink-primary mt-4 leading-tight">
                Collaborate for <span className="text-primary-500">Change</span>
              </h1>
              <p className="text-body text-ink-secondary mt-6 max-w-2xl">
                We're always looking for partners who share our vision of empowering rural communities. 
                Whether you're a government agency, corporation, foundation, or educational institution — 
                let's work together to create lasting impact.
              </p>
            </div>
          </div>
        </section>

        {/* Contact via email */}
        <section className="section-md bg-surface-section">
          <div className="container-content max-w-2xl mx-auto text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 mb-5">
              <Mail size={28} />
            </div>
            <h2 className="text-2xl lg:text-3xl font-heading font-bold text-ink-primary">Connect With Us</h2>
            <p className="text-body text-ink-secondary mt-3 max-w-lg mx-auto">
              Prefer to reach out directly? Send us an email with your partnership inquiry and we'll respond promptly.
            </p>
            <a
              href="mailto:partners@ravivarvichar.org?subject=Partnership%20Inquiry"
              className="inline-flex items-center gap-2 mt-6 text-lg font-semibold text-primary-500 hover:text-primary-600 transition-colors"
            >
              <Mail size={20} /> partners@ravivarvichar.org
            </a>
            <p className="text-sm text-ink-secondary mt-2">(Email address to be updated — click to open your default mail app)</p>
          </div>
        </section>

        {/* Form */}
        <section className="section-md bg-surface-white">
          <div className="container-content max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-heading font-bold text-ink-primary">Send Us a Message</h2>
              <p className="text-body text-ink-secondary mt-3">Fill out the form below and we'll get back to you.</p>
            </div>
            <div className="card p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-ink-primary mb-2">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" className="input-field w-full" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink-primary mb-2">Organization</label>
                    <input type="text" name="organization" value={formData.organization} onChange={handleChange} placeholder="Your organization" className="input-field w-full" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-ink-primary mb-2">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your email" className="input-field w-full" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink-primary mb-2">Phone Number</label>
                    <input type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleChange} placeholder="Your phone number" className="input-field w-full" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink-primary mb-2">Message (optional)</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your interest in partnership..." rows={4} className="input-field w-full resize-none" />
                </div>
                {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : <><Handshake size={18} /> Send Partnership Inquiry</>}
                </button>
              </form>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
