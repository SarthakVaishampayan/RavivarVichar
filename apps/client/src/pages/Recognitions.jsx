import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/shared/Button';
import api from '../lib/axios';

export default function Recognitions() {
  const [loaded, setLoaded] = useState(false);
  const [recognitions, setRecognitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = '/featured-hero.jpg';
    img.onload = () => setLoaded(true);
  }, []);

  useEffect(() => {
    api.get('/recognitions', { params: { limit: 50, sort: '-date' } })
      .then(({ data }) => setRecognitions(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <>
      <Helmet>
        <title>Recognitions — Ravivar Vichar</title>
        <meta name="description" content="See the recognitions and validations Ravivar Vichar has received from impact makers and organisations." />
      <link rel="preload" as="image" href="/featured-hero.jpg" />
      </Helmet>

      <PageLayout>
        {/* Hero */}
        <section className="relative min-h-[70vh] lg:min-h-[calc(100vh-90px)] flex items-start overflow-hidden max-lg:pt-[12vh] pt-[15vh]">
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
              <span className="text-sm font-semibold tracking-[0.15em] text-white/70 uppercase inline-block mb-5">RECOGNITIONS</span>
              <h1 className="text-3xl max-lg:text-hero-mobile lg:text-5xl text-white leading-[1.2]">
                Honoured by <span className="text-primary-500">Impact Makers</span>
              </h1>
              <p className="text-lg text-white/70 mt-6 leading-relaxed max-w-[550px]">
                Recognitions and validations from organisations and leaders who value our contribution to social change.
              </p>
            </div>
          </div>
        </section>

        <section className="section-lg bg-surface-section">
          <div className="container-site">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent" />
          </div>
        ) : recognitions.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-ink-secondary">No recognitions yet.</p>
          </div>
        ) : (
          <div className="space-y-20">
            {recognitions.map((item, i) => (
              <motion.div
                key={item._id}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7 }}
              >
                {/* Image — reduced width by ~30% */}
                <div className={`${i % 2 === 1 ? 'lg:order-2' : ''} max-lg:max-w-sm lg:max-w-[70%] mx-auto`}>
                  {item.imageUrl ? (
                    <div className="img-card overflow-hidden shadow-card">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-56 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-56 rounded-2xl bg-gray-100">
                      <Newspaper size={64} className="text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="flex items-center gap-3 mb-4">
                    <Newspaper size={20} className="text-primary-500/40" />
                    <span className="text-sm font-medium text-ink-secondary">{item.source}</span>
                    {item.date && (
                      <>
                        <span className="text-ink-secondary/30">•</span>
                        <span className="text-sm text-ink-secondary flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(item.date)}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-[32px] font-heading font-bold text-ink-primary leading-tight mb-4">
                    {item.title}
                  </h3>
                  {item.summary && (
                    <p className="text-body text-ink-secondary leading-relaxed mb-6 line-clamp-3">
                      {item.summary}
                    </p>
                  )}
                  <Link
                    to={`/recognitions/${item.slug || item._id}`}
                    className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors group"
                  >
                    Read More
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Button variant="outline" to="/" arrow>
            Back to Home
          </Button>
        </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
