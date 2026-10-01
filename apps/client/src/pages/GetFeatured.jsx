import { useState } from 'react';
import HeroSlideshow from '../components/shared/HeroSlideshow';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/shared/Button';
import api from '../lib/axios';
import { Check, Loader2, ArrowLeft, Star } from 'lucide-react';

export default function GetFeatured() {



  const [formData, setFormData] = useState({
    name: '',
    placeOfWork: '',
    typeOfWork: '',
    phoneNo: '',
    storySummary: '',
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
                Your story has been submitted successfully! Our editorial team will review it and get in touch with you.
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
        <meta name="description" content="Share your story with us and get featured on Ravivar Vichar's journalism and media platform." />
        <link rel="preload" as="image" href="/featured-hero.webp" type="image/webp" />
      </Helmet>

      <PageLayout>
        <section className="relative min-h-[70vh] lg:min-h-[calc(100vh-90px)] flex items-center overflow-hidden max-md:items-start max-md:pt-[12vh] lg:items-start lg:pt-[25vh]">
          {/* Rotating hero background */}
          <HeroSlideshow startIndex={8} />
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
                Have an inspiring story of enterprise, innovation, or grassroots impact? We'd love to feature your journey.
                Fill out the form below and our editorial team will review your pitch.
              </p>
            </div>
          </div>
        </section>

        <section className="section-md bg-surface-white">
          <div className="container-content max-w-2xl mx-auto">
            <div className="card p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="featured-name" className="block text-sm font-semibold text-ink-primary mb-2">
                    Full Name <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="featured-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="input-field w-full"
                    required
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="featured-place" className="block text-sm font-semibold text-ink-primary mb-2">
                    Location / Place of Work <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="featured-place"
                    type="text"
                    name="placeOfWork"
                    value={formData.placeOfWork}
                    onChange={handleChange}
                    placeholder="e.g. Indore, Madhya Pradesh"
                    className="input-field w-full"
                    required
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="featured-type" className="block text-sm font-semibold text-ink-primary mb-2">
                    Type of Work / Domain <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="featured-type"
                    type="text"
                    name="typeOfWork"
                    value={formData.typeOfWork}
                    onChange={handleChange}
                    placeholder="e.g. Handicrafts, Micro-enterprise, Agriculture, Tech"
                    className="input-field w-full"
                    required
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="featured-phone" className="block text-sm font-semibold text-ink-primary mb-2">
                    Phone Number <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="featured-phone"
                    type="tel"
                    name="phoneNo"
                    autoComplete="tel"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    className="input-field w-full"
                    required
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="featured-summary" className="block text-sm font-semibold text-ink-primary mb-2">
                    Story Summary & Highlights <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="featured-summary"
                    name="storySummary"
                    value={formData.storySummary}
                    onChange={handleChange}
                    placeholder="Briefly describe your journey, challenges overcome, and the impact of your work..."
                    className="input-field w-full min-h-[140px] resize-y"
                    required
                    aria-required="true"
                  />
                </div>

                <p className="text-xs text-ink-secondary/70">
                  We respect your privacy. Your information is only used by the Ravivar Vichar editorial team to evaluate your story submission and will never be shared.
                </p>

                {error && (
                  <div role="alert" aria-live="assertive" className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center"
                >
                  {loading ? <><Loader2 size={18} className="animate-spin mr-2" /> Submitting...</> : <><Star size={18} className="mr-2" /> Submit for Review</>}
                </button>
              </form>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
