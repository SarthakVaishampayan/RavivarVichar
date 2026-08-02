import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../shared/SectionHeading';
import Button from '../shared/Button';
import api from '../../lib/axios';

export default function Recognitions({ bgClass = 'bg-surface-white' }) {
  const [recognitions, setRecognitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/recognitions', { params: { limit: 3, sort: '-date' } })
      .then(({ data }) => {
        if (data.data && data.data.length > 0) {
          setRecognitions(data.data);
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
          label="Recognitions"
          title="As Seen With"
          description="Recognitions Ravivar Vichar has received from impact makers."
        />

        {recognitions.length > 0 ? (
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
                {/* Image */}
                <div className={`${i % 2 === 1 ? 'lg:order-2' : ''}`}>
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
                    <span className="text-sm text-ink-secondary font-medium">{item.source}</span>
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
        ) : (
          <div className="text-center py-12">
            <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-ink-secondary text-lg">No recognitions added yet.</p>
            <p className="text-sm text-ink-secondary/60 mt-1">Add your first recognition from the admin panel.</p>
          </div>
        )}

        <div className="text-center mt-16">
          <Button variant="primary" to="/recognitions" arrow>
            View All Recognitions
          </Button>
        </div>
      </div>
    </section>
  );
}
