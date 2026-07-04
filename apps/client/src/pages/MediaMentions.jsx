import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ExternalLink, Newspaper, Calendar } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/shared/Button';
import api from '../lib/axios';

export default function MediaMentions() {
  const [mentions, setMentions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/media-mentions', { params: { limit: 50, sort: '-date' } })
      .then(({ data }) => setMentions(data.data || []))
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
        <title>Media Mentions — RavivarVichar</title>
        <meta name="description" content="See all media coverage and mentions of RavivarVichar's work in the news." />
      </Helmet>

      <Navbar />
      <PageLayout
        title="Media Mentions"
        subtitle="Coverage and mentions from media outlets featuring our work and impact."
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent" />
          </div>
        ) : mentions.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-ink-secondary">No media mentions yet.</p>
          </div>
        ) : (
          <div className="space-y-20">
            {mentions.map((item, i) => (
              <motion.div
                key={item._id}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7 }}
              >
                {/* Image */}
                <div className={`${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  {item.imageUrl ? (
                    <div className="img-card overflow-hidden shadow-card">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-80 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-80 rounded-2xl bg-gray-100">
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
                    <p className="text-body text-ink-secondary leading-relaxed mb-6">
                      {item.summary}
                    </p>
                  )}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
                  >
                    Read Full Article
                    <ExternalLink size={16} />
                  </a>
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
      </PageLayout>
      <Footer />
    </>
  );
}
