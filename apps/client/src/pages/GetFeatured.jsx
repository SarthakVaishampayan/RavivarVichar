import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/shared/Button';
import api from '../lib/axios';
import { Check, Loader2, ArrowLeft, Star } from 'lucide-react';

export default function GetFeatured() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/featured-hero.jpg';
    img.onload = () => setLoaded(true);
  }, []);

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
          <title>Get Featured — Ravivar Vichar</title>
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
        <title>Get Featured — Ravivar Vichar</title>
        <meta name="description" content="Share your story with us and get featured on Ravivar Vichar's platform." />
      <link rel="preload" as="image" href="/featured-hero.jpg" />
      </Helmet>

      <PageLayout>
        <section className="relative min-h-[70vh] lg:min-h-[calc(100vh-90px)] flex items-start overflow-hidden max-lg:pt-[12vh] pt-[25vh]">
          {/* Background image */}
          <div className="absolute inset-0 bg-gray-900">
            <img
  src="/featured-hero.jpg"
  alt=""
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
              <Link to="/" className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors mb-8">
                <ArrowLeft size={16} /> Back to Home
              </Link>
              <span className="text-sm font-semibold tracking-[0.15em] text-white/70 uppercase block mb-5">GET FEATURED</span>
              <h1 className="text-3xl max-lg:text-hero-mobile lg:text-5xl text-white leading-[1.2]">
                Share Your <span className="text-primary-500">Story</span>
              </h1>
              <p className="text-lg text-white/70 mt-6 leading-relaxed max-w-[550px]">
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
