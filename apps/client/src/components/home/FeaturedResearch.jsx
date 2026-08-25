import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Quote } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';
import Button from '../shared/Button';
import api from '../../lib/axios';

export default function FeaturedResearch({ bgClass = 'bg-surface-white' }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/articles', { params: { category: 'Success Stories', status: 'published', limit: 3, sort: '-createdAt' } })
      .then(({ data }) => {
        if (data.data && data.data.length > 0) {
          setStories(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section className={`section-lg ${bgClass} section-separator`}>
      <div className="container-site">
        <SectionHeading
          label="Success Stories"
          title="Real Stories, Real Impact"
          description="Inspiring journeys of individuals and communities transforming their lives through our programs."
        />

        {stories.length > 0 ? (
          <>
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
                    <Link to={`/articles/${item.slug}`} className="block img-card overflow-hidden shadow-card hover:shadow-lg transition-shadow">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-56 object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-56 bg-gray-100">
                          <Quote size={48} className="text-gray-300" />
                        </div>
                      )}
                    </Link>
                  </div>

                  {/* Content */}
                  <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                    {item.location && (
                      <div className="flex items-center gap-3 mb-4">
                        <Quote size={24} className="text-primary-500/40" />
                        <span className="text-sm text-ink-secondary font-medium">{item.location}</span>
                      </div>
                    )}
                    <Link to={`/articles/${item.slug}`}>
                      <h3 className="text-[32px] font-heading font-bold text-ink-primary leading-tight mb-4 hover:text-primary-500 transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-body text-ink-secondary leading-relaxed">
                      {item.excerpt || item.summary}
                    </p>
                    <Link
                      to={`/articles/${item.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors mt-4"
                    >
                      Read full story →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Button variant="primary" to="/articles/section/success-stories" arrow>
                View More Stories
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Quote size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-ink-secondary text-lg">No success stories added yet.</p>
            <p className="text-sm text-ink-secondary/60 mt-1">Add the first story from the admin panel.</p>
          </div>
        )}
      </div>
    </section>
  );
}
