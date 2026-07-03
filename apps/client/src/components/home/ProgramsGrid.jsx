import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../shared/SectionHeading';
import Button from '../shared/Button';
import Card from '../shared/Card';
import api from '../../lib/axios';

export default function ProgramsGrid() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { data } = await api.get('/programs', { params: { limit: 3 } });
        setPrograms(data.data || []);
      } catch (err) {
        console.error('Failed to fetch programs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  return (
    <section className="section-lg bg-surface-white">
      <div className="container-site">
        <SectionHeading
          label="Our Programs"
          title="What We Do"
          description="We design and deliver programs that create lasting impact in rural communities across Rajasthan."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(loading ? [] : programs).map((program, i) => (
            <motion.div
              key={program._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card
                image={program.banner}
                category={program.objectives?.[0] || 'Program'}
                title={program.title}
                description={program.description}
                to={`/programs/${program.slug}`}
              />
            </motion.div>
          ))}
          {!loading && programs.length === 0 && (
            <div className="col-span-3 text-center py-12 text-ink-secondary">
              <p>No programs available yet.</p>
            </div>
          )}
        </div>

        <div className="text-center mt-14">
          <Button variant="outline" to="/programs" arrow>
            View All Programs
          </Button>
        </div>
      </div>
    </section>
  );
}
