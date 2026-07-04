import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, User } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';
import api from '../../lib/axios';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    api.get('/testimonials', { params: { limit: 10, sort: '-createdAt' } })
      .then(({ data }) => {
        if (data.data && data.data.length > 0) {
          setTestimonials(data.data);
        }
      })
      .catch(() => {});
  }, []);

  if (testimonials.length === 0) return null;

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="section-lg bg-surface-white relative overflow-hidden">
      {/* Decorative quote marks */}
      <div className="absolute top-20 right-20 opacity-[0.03] pointer-events-none">
        <Quote size={200} />
      </div>

      <div className="container-site">
        <SectionHeading
          label="Testimonials"
          title="Voices From the Community"
          description="Hear from the people whose lives have been transformed through our programs."
        />

        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="text-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-8 border-4 border-primary-100 shadow-soft">
                {t.image || t.photo ? (
                  <img
                    src={t.image || t.photo}
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-50 flex items-center justify-center">
                    <User size={28} className="text-primary-400" />
                  </div>
                )}
              </div>

              <Quote size={28} className="mx-auto text-primary-300 mb-6" />

              <blockquote className="text-xl md:text-2xl text-text-primary font-medium leading-relaxed mb-8 max-w-3xl mx-auto">
                "{t.quote || t.content}"
              </blockquote>

              <div className="mb-2">
                <p className="text-lg font-semibold text-text-primary">
                  {t.name}
                </p>
                <p className="text-sm text-text-secondary">
                  {t.role || t.designation || ''}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 text-text-secondary hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'bg-primary-500 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 text-text-secondary hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
