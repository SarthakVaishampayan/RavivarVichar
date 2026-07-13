import { Helmet } from 'react-helmet-async';
import PageLayout from '../components/layout/PageLayout';
import SectionHeading from '../components/shared/SectionHeading';
import Button from '../components/shared/Button';
import { Mail, Phone, MapPin, Clock, Send, Check, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../lib/axios';

const contactInfo = [
  { icon: MapPin, label: 'Address', value: '2nd Floor, Corporate House, 210 B-Block, 169, RNT Marg, Indore, Madhya Pradesh 452001' },
  { icon: Phone, label: 'Phone', value: '+91-7470527279' },
  { icon: Phone, label: 'Alternate', value: '0731-4073804' },
  { icon: Mail, label: 'Email', value: 'ravivar.vichar@ravivarvichar.in' },
  { icon: Clock, label: 'Office Hours', value: 'Mon — Fri, 9:00 AM — 5:00 PM' },
];

const faqs = [
  { q: 'How can I volunteer with Ravivar Vichar?', a: 'We welcome volunteers with diverse skills. Please fill out the contact form or email us directly, and our team will reach out with current opportunities.' },
  { q: 'How do I partner with your organization?', a: 'We collaborate with NGOs, government agencies, corporations, and academic institutions. Reach out through our contact form to discuss partnership possibilities.' },
  { q: 'Can I donate to a specific program?', a: 'Yes! You can specify the program you\'d like to support when donating. Your contribution will be directed to that program\'s activities.' },
  { q: 'How are donations utilized?', a: '85% of donations go directly to program activities, 10% to capacity building and training, and 5% to administrative costs. We publish annual impact reports.' },
];

export default function Contact() {
  const [loaded, setLoaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    const img = new Image();
    img.src = '/contact-hero.jpg';
    img.onload = () => setLoaded(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us — Ravivar Vichar</title>
        <meta name="description" content="Get in touch with Ravivar Vichar. Reach out for partnerships, volunteering, donations, or general inquiries." />
      <link rel="preload" as="image" href="/contact-hero.jpg" />
      </Helmet>

      <PageLayout>
        {/* Hero */}
        <section className="relative min-h-[70vh] lg:min-h-[calc(100vh-90px)] flex items-start overflow-hidden max-lg:pt-[12vh] pt-[35vh]">
          {/* Background image */}
          <div className="absolute inset-0 bg-gray-900">
            <img
  src="/contact-hero.jpg"
  alt="Contact Ravivar Vichar"
  onLoad={() => setLoaded(true)}
  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
    loaded ? 'opacity-100' : 'opacity-0'
  }`}
/>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(16,16,16,0.85) 0%, rgba(16,16,16,0.70) 35%, rgba(16,16,16,0.25) 70%, rgba(16,16,16,0.08) 100%)' }} />
          </div>
          {/* Content */}
          <div className="w-full relative z-10 max-lg:px-6 pl-[5vw]">
            <div className="max-w-[580px]">
              <span className="text-sm font-semibold tracking-[0.15em] text-white/70 uppercase inline-block mb-5">CONTACT US</span>
              <h1 className="text-3xl max-lg:text-hero-mobile lg:text-5xl text-white leading-[1.2]">
                Let's{' '}
                <span className="text-[#F5A623]">Work Together</span>
              </h1>
              <p className="text-lg text-white/70 mt-6 leading-relaxed max-w-[550px]">
                Have a question, want to partner with us, or interested in volunteering? 
                We'd love to hear from you. Reach out and let's make a difference together.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Grid — 3 Columns: Info, Form, Map */}
        <section className="section-md bg-surface-white">
          <div className="container-content">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Column 1: Contact Info & Address */}
              <div className="space-y-8">
                <h3 className="text-lg font-heading font-bold text-ink-primary mb-6">Get in Touch</h3>
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
                        <Icon size={22} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-ink-primary uppercase tracking-wider">{item.label}</h4>
                        <p className="text-body text-ink-secondary mt-1">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Column 2: Contact Form */}
              <div>
                <div className="card p-8 lg:p-10">
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 mb-6">
                        <Check size={32} />
                      </div>
                      <h3 className="text-2xl font-heading font-bold text-ink-primary">Message Sent!</h3>
                      <p className="text-body text-ink-secondary mt-3">Thank you for reaching out. We'll get back to you within 24-48 hours.</p>
                      <Button variant="primary" className="mt-6" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="label">Full Name *</label>
                          <input type="text" className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Your name" />
                        </div>
                        <div>
                          <label className="label">Email Address *</label>
                          <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" />
                        </div>
                      </div>
                      <div>
                        <label className="label">Subject *</label>
                        <select className="input-field" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required>
                          <option value="">Select a subject</option>
                          <option value="Partnership">Partnership Inquiry</option>
                          <option value="Volunteering">Volunteering</option>
                          <option value="Donation">Donation</option>
                          <option value="General">General Inquiry</option>
                          <option value="Media">Media & Press</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">Message *</label>
                        <textarea className="input-field min-h-[150px] resize-y" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required placeholder="Tell us how you'd like to connect..." />
                      </div>
                      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  )}
                </div>
              </div>

              {/* Column 3: Google Maps */}
              <div>
                <h3 className="text-lg font-heading font-bold text-ink-primary mb-6">Visit Our Office</h3>
                <div className="rounded-2xl overflow-hidden shadow-card border border-gray-100">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d460.03908791609507!2d75.87185030092873!3d22.716615808751925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd16b91f31af%3A0xef32971080ddee88!2sRavivar%20Vichar!5e0!3m2!1sen!2sin!4v1783927697991!5m2!1sen!2sin"
                    width="100%"
                    style={{ border: 0, height: '520px' }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Ravivar Vichar Office Location"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-md bg-surface-section">
          <div className="container-content">
            <SectionHeading
              label="FAQ"
              title="Frequently Asked Questions"
              description="Quick answers to common questions about our work and how to get involved."
            />
            <div className="max-w-3xl mx-auto mt-12 space-y-4">
              {faqs.map((faq) => (
                <details key={faq.q} className="card group open:ring-1 open:ring-primary-200 open:shadow-soft">
                  <summary className="p-6 cursor-pointer text-lg font-semibold text-ink-primary flex items-center justify-between gap-4 marker:content-none">
                    {faq.q}
                    <span className="shrink-0 transition-transform duration-300 group-open:rotate-180 text-primary-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-body text-ink-secondary">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
