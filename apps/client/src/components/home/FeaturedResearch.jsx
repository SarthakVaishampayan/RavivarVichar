import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';
import Button from '../shared/Button';
import api from '../../lib/axios';

export default function FeaturedResearch() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    api.get('/articles', { params: { category: 'Success Stories', status: 'published', limit: 3, sort: '-createdAt' } })
      .then(({ data }) => {
        if (data.data && data.data.length > 0) {
          setStories(data.data);
        }
      })
      .catch(() => {});
  }, []);

  if (stories.length === 0) return null;

  return (
    <section className="section-lg bg-surface-section">
      <div className="container-site">
        <SectionHeading
          label="Success Stories"
          title="Real Stories, Real Impact"
          description="Inspiring journeys of individuals and communities transforming their lives through our programs."
        />

        <div className="space-y-20">
          {stories.map((item, i) => (
            <motion.div
              key={item._id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7 }}
            >
              {/* Image */}
              <div className={`${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="img-card overflow-hidden shadow-card">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-80 object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-80 bg-gray-100">
                      <Quote size={48} className="text-gray-300" />
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <Quote size={24} className="text-primary-500/40" />
                  <span className="text-sm text-ink-secondary font-medium">{item.location || item.author || ''}</span>
                </div>
                <h3 className="text-[32px] font-heading font-bold text-ink-primary leading-tight mb-4">
                  {item.title}
                </h3>
                <p className="text-body text-ink-secondary leading-relaxed">
                  {item.excerpt || item.summary}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button variant="primary" to="/knowledge-hub/section/success-stories" arrow>
            View More Stories
          </Button>
        </div>
      </div>
    </section>
  );
}
