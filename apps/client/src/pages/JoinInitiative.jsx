import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import FloatingDots from '../components/shared/FloatingDots';
import Button from '../components/shared/Button';
import api from '../lib/axios';
import { Check, Loader2, ArrowLeft, Heart, Users, Target, Award } from 'lucide-react';

export default function JoinInitiative() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNo: '',
    city: '',
    state: '',
    reasonToJoin: '',
    briefAboutWork: '',
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
      await api.post('/join-initiative', formData);
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
        <Helmet>
          <title>Join Our Initiative — RavivarVichar</title>
        </Helmet>
        <PageLayout>
          <section className="section-md min-h-[60vh] flex items-center">
            <div className="container-content text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
                <Check size={32} />
              </div>
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-ink-primary">
                Welcome Aboard!
              </h1>
              <p className="text-body text-ink-secondary mt-4 max-w-lg mx-auto">
                Thank you for joining our initiative! Our team will review your application and reach out to you shortly.
              </p>
              <Button variant="primary" to="/" className="mt-8">
                Back to Home
              </Button>
            </div>
          </section>
        </PageLayout>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Join Our Initiative — RavivarVichar</title>
        <meta name="description" content="Join RavivarVichar's initiative to empower rural communities through research, entrepreneurship, and self-help groups." />
      </Helmet>

      <PageLayout>
        <section className="relative overflow-hidden bg-surface-secondary py-24 lg:py-28">
          <FloatingDots />
          <div className="container-content relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-ink-secondary hover:text-primary-500 transition-colors mb-8">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <div className="max-w-3xl">
              <span className="section-label">JOIN OUR INITIATIVE</span>
              <h1 className="text-hero-mobile lg:text-hero text-ink-primary mt-4 leading-tight">
                Be Part of the <span className="text-primary-500">Change</span>
              </h1>
              <p className="text-body text-ink-secondary mt-6 max-w-2xl">
                At RavivarVichar, we believe that real change happens when passionate individuals come together. 
                Whether you're a researcher, community worker, entrepreneur, or simply someone who wants to make 
                a difference — we invite you to join our mission of empowering rural communities across Rajasthan.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="section-md bg-surface-section">
          <div className="container-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Target, title: 'Meaningful Impact', description: 'Work directly with rural communities and see the tangible difference your efforts make in people\'s lives.' },
                { icon: Users, title: 'Collaborative Network', description: 'Join a growing network of changemakers, researchers, and community leaders dedicated to rural development.' },
                { icon: Award, title: 'Skill Development', description: 'Gain hands-on experience in grassroots development, research, and community mobilization.' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="card p-8 lg:p-10 text-center">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 mb-6">
                      <Icon size={28} />
                    </div>
                    <h3 className="text-card font-heading font-bold text-ink-primary mb-4">{item.title}</h3>
                    <p className="text-body text-ink-secondary">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="section-md bg-surface-white">
          <div className="container-content max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-heading font-bold text-ink-primary">Apply to Join</h2>
              <p className="text-body text-ink-secondary mt-3">Fill out the form below and we'll get back to you.</p>
            </div>
            <div className="card p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-ink-primary mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="input-field w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink-primary mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNo"
                      value={formData.phoneNo}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      className="input-field w-full"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-ink-primary mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Your city"
                      className="input-field w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink-primary mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Your state"
                      className="input-field w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink-primary mb-2">Reason to Join</label>
                  <textarea
                    name="reasonToJoin"
                    value={formData.reasonToJoin}
                    onChange={handleChange}
                    placeholder="Why do you want to join this initiative?"
                    rows={3}
                    className="input-field w-full resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink-primary mb-2">Brief About Your Work</label>
                  <textarea
                    name="briefAboutWork"
                    value={formData.briefAboutWork}
                    onChange={handleChange}
                    placeholder="Tell us briefly about your background, skills, or current work"
                    rows={3}
                    className="input-field w-full resize-none"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center"
                >
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : <><Heart size={18} /> Submit Application</>}
                </button>
              </form>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
