import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Newspaper } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';
import Button from '../shared/Button';
import api from '../../lib/axios';

export default function MediaMentions() {
  const [mentions, setMentions] = useState([]);

  useEffect(() => {
    api.get('/media-mentions', { params: { limit: 3, sort: '-date' } })
      .then(({ data }) => {
        if (data.data && data.data.length > 0) {
          setMentions(data.data);
        }
      })
      .catch(() => {});
  }, []);

  if (mentions.length === 0) return null;

  return (
    <section className="section-lg bg-surface-section">
      <div className="container-site">
        <SectionHeading
          label="Media Mentions"
          title="As Seen In"
          description="Coverage and mentions from media outlets that have featured our work and impact."
        />

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
                  <span className="text-sm text-ink-secondary font-medium">{item.source}</span>
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

        <div className="text-center mt-16">
          <Button variant="primary" to="/media-mentions" arrow>
            View All Mentions
          </Button>
        </div>
      </div>
    </section>
  );
}
