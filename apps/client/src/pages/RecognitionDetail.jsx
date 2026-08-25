import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Newspaper, ExternalLink } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/shared/Button';
import api from '../lib/axios';

export default function RecognitionDetail() {
  const { slug } = useParams();
  const [recognition, setRecognition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/recognitions/slug/${slug}`)
      .then(({ data }) => setRecognition(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <PageLayout>
        <div className="container-content py-32 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent mx-auto" />
        </div>
      </PageLayout>
    );
  }

  if (!recognition) {
    return (
      <PageLayout>
        <div className="container-content py-32 text-center">
          <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-3xl font-heading font-bold text-ink-primary">Recognition Not Found</h1>
          <p className="text-body text-ink-secondary mt-4">The recognition you're looking for doesn't exist.</p>
          <Button variant="primary" to="/recognitions" className="mt-8">Back to Recognitions</Button>
        </div>
      </PageLayout>
    );
  }

  const formattedDate = recognition.date
    ? new Date(recognition.date).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : '';

  // ─── SEO values ───
  const canonicalUrl = (() => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin.replace(/\/\/www\./, '//');
    return `${origin}${window.location.pathname}`;
  })();
  const description = recognition.summary?.slice(0, 160) || `Recognition from ${recognition.source}`;
  const ogImage = recognition.imageUrl || '';

  return (
    <>
      <Helmet>
        <title>{recognition.title} — Recognitions — Ravivar Vichar</title>
        <meta name="description" content={description} />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={recognition.title} />
        <meta property="og:description" content={description} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Ravivar Vichar" />
        <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:title" content={recognition.title} />
        <meta name="twitter:description" content={description} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: recognition.title,
            description,
            ...(ogImage ? { image: [ogImage] } : {}),
            datePublished: recognition.date,
            author: { '@type': 'Organization', name: recognition.source },
            publisher: { '@type': 'Organization', name: 'Ravivar Vichar' },
            mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
          })}
        </script>
      </Helmet>

      <PageLayout>
        {/* Header */}
        <section className="bg-surface-white pt-24 pb-8 lg:pb-12">
          <div className="container-content">
            <div className="max-w-4xl mx-auto">
              <Link
                to="/recognitions"
                className="inline-flex items-center gap-2 text-sm font-medium text-ink-secondary hover:text-primary-500 transition-colors mb-8"
              >
                <ArrowLeft size={16} /> Back to Recognitions
              </Link>

              <div className="flex items-center gap-3 mb-4">
                <Newspaper size={20} className="text-primary-500/40" />
                <span className="text-sm font-medium text-ink-secondary">{recognition.source}</span>
                {formattedDate && (
                  <>
                    <span className="text-ink-secondary/30">•</span>
                    <span className="text-sm text-ink-secondary flex items-center gap-1">
                      <Calendar size={14} /> {formattedDate}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-ink-primary leading-tight">
                {recognition.title}
              </h1>

              {recognition.url && (
                <a
                  href={recognition.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors mt-6"
                >
                  <ExternalLink size={16} /> View Original Source
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Main Image */}
        {recognition.imageUrl && (
          <section className="bg-surface-white pb-8">
            <div className="container-content">
              <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-xl">
                <img
                  src={recognition.imageUrl}
                  alt={recognition.title}
                  className="w-full h-auto max-h-[500px] object-cover"
                />
              </div>
            </div>
          </section>
        )}

        {/* Gallery */}
        {recognition.gallery && recognition.gallery.length > 0 && (
          <section className="bg-surface-white pb-8">
            <div className="container-content">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-heading font-bold text-ink-primary mb-6">Additional Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {recognition.gallery.map((img, i) => (
                    <motion.img
                      key={i}
                      src={img}
                      alt={`${recognition.title} - Photo ${i + 1}`}
                      loading="lazy"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="w-full h-40 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => window.open(img, '_blank')}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Summary Content */}
        {recognition.summary && (
          <section className="section-md bg-surface-white">
            <div className="container-content">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-xl font-heading font-bold text-ink-primary mb-4">About This Recognition</h2>
                <div className="text-body text-ink-secondary leading-relaxed whitespace-pre-line">
                  {recognition.summary}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Back CTA */}
        <section className="pb-16 bg-surface-white">
          <div className="container-content">
            <div className="max-w-3xl mx-auto text-center">
              <Button variant="outline" to="/recognitions" arrow>
                View All Recognitions
              </Button>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
