import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import FloatingDots from '../components/shared/FloatingDots';
import Button from '../components/shared/Button';
import api from '../lib/axios';
import { Check, Loader2, ArrowLeft, Star } from 'lucide-react';

export default function GetFeatured() {
  const [formData, setFormData] = useState({
    name: '',
    placeOfWork: '',
    typeOfWork: '',
    phoneNo: '',
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
      await api.post('/feature-requests', formData);
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
          <title>Get Featured — RavivarVichar</title>
        </Helmet>
        <PageLayout>
          <section className="section-md min-h-[60vh] flex items-center">
            <div className="container-content text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
                <Check size={32} />
              </div>
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-ink-primary">
                Thank You!
              </h1>
              <p className="text-body text-ink-secondary mt-4 max-w-lg mx-auto">
                Your story has been submitted successfully! Our team will review it and get back to you.
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
        <title>Get Featured — RavivarVichar</title>
        <meta name="description" content="Share your story with us and get featured on RavivarVichar's platform." />
      </Helmet>

      <PageLayout>
        <section className="relative overflow-hidden bg-surface-secondary py-24 lg:py-28">
          <FloatingDots />
          <div className="container-content relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-ink-secondary hover:text-primary-500 transition-colors mb-8">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <div className="max-w-3xl">
              <span className="section-label">GET FEATURED</span>
              <h1 className="text-hero-mobile lg:text-hero text-ink-primary mt-4 leading-tight">
                Share Your <span className="text-primary-500">Story</span>
              </h1>
              <p className="text-body text-ink-secondary mt-6 max-w-2xl">
                Have an inspiring story to tell? We'd love to feature you on our platform. 
                Fill out the form below and our team will review your submission.
              </p>
            </div>
          </div>
        </section>

        <section className="section-md bg-surface-white">
          <div className="container-content max-w-2xl mx-auto">
            <div className="card p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <label className="block text-sm font-semibold text-ink-primary mb-2">Place of Work</label>
                  <input
                    type="text"
                    name="placeOfWork"
                    value={formData.placeOfWork}
                    onChange={handleChange}
                    placeholder="Where do you work?"
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink-primary mb-2">Type of Work</label>
                  <input
                    type="text"
                    name="typeOfWork"
                    value={formData.typeOfWork}
                    onChange={handleChange}
                    placeholder="What kind of work do you do?"
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

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center"
                >
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : <><Star size={18} /> Submit for Review</>}
                </button>
              </form>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
