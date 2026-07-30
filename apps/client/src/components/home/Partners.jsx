import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../shared/SectionHeading';
import api from '../../lib/axios';

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/partners', { params: { status: 'active', limit: 20, sort: 'name' } })
      .then(({ data }) => {
        if (data.data && data.data.length > 0) {
          setPartners(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section className="section-lg bg-surface-secondary">
      <div className="container-site">
        <SectionHeading
          label="Our Partners"
          title="Trusted By"
          description="We collaborate with leading organizations to amplify our impact."
        />

        {partners.length > 0 ? (
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 lg:gap-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {partners.map((partner, i) => (
              <motion.div
                key={partner._id}
                className="group relative"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <div className="flex items-center justify-center w-28 h-28 lg:w-32 lg:h-32 rounded-2xl bg-white shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      loading="lazy"
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <span className="text-2xl lg:text-3xl font-bold font-heading text-primary-600">
                      {partner.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </span>
                  )}
                </div>
                {/* Tooltip on hover */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  <span className="text-xs font-medium text-ink-secondary bg-white px-3 py-1 rounded-full shadow-soft">
                    {partner.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-2xl bg-gray-100 mb-4">
              <span className="text-2xl font-bold text-gray-300">P</span>
            </div>
            <p className="text-ink-secondary text-lg">No partners added yet.</p>
            <p className="text-sm text-ink-secondary/60 mt-1">Add the first partner from the admin panel.</p>
          </div>
        )}
      </div>
    </section>
  );
}
