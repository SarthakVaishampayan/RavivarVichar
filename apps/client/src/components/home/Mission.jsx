import { motion } from 'framer-motion';
import SectionHeading from '../shared/SectionHeading';
import Button from '../shared/Button';
import FloatingDots from '../shared/FloatingDots';

export default function Mission() {
  return (
    <section className="section-lg relative overflow-hidden bg-surface-secondary">
      <FloatingDots count={4} />

      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left - Image Collage */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
          >
            {/* Main circle */}
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden mx-auto shadow-card border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80"
                alt="Our mission"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlapping circle */}
            <div className="absolute -bottom-8 right-8 w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80"
                alt="Community work"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Decorative dotted pattern behind */}
            <div className="absolute -top-10 -left-10 w-40 h-40 opacity-10">
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-primary-500" />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <SectionHeading
              label="Our Mission"
              title="Empowering Communities, Transforming Lives"
              description=""
              align="left"
            />
            <div className="space-y-5 text-body text-text-secondary">
              <p>
                At RavivarVichar, we believe that sustainable change comes from within
                communities. Our mission is to equip rural women and marginalized groups
                with the knowledge, skills, and resources they need to build better futures
                for themselves and their families.
              </p>
              <p>
                Through research-driven programs, financial literacy initiatives, and
                grassroots entrepreneurship support, we're creating a ecosystem where
                rural communities can thrive on their own terms.
              </p>
            </div>
            <div className="mt-8">
              <Button variant="primary" to="/about" arrow>
                Learn More About Us
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
