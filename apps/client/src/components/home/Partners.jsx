import { motion } from 'framer-motion';
import SectionHeading from '../shared/SectionHeading';

const partners = [
  { name: 'NABARD', category: 'Government' },
  { name: 'Tata Trusts', category: 'Corporate' },
  { name: 'SEWA Bharat', category: 'NGO' },
  { name: 'IIM Udaipur', category: 'Educational' },
  { name: 'Rajasthan Government', category: 'Government' },
  { name: 'ICICI Foundation', category: 'Corporate' },
];

export default function Partners() {
  return (
    <section className="section-lg bg-surface-white">
      <div className="container-site">
        <SectionHeading
          label="Our Partners"
          title="Trusted By"
          description="We collaborate with leading organizations to amplify our impact."
        />

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              className="flex flex-col items-center justify-center p-6 rounded-card bg-surface-secondary border border-gray-100 hover:shadow-soft transition-all duration-300 h-32"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-2">
                <span className="text-primary-600 font-bold font-heading text-lg">
                  {partner.name.charAt(0)}
                </span>
              </div>
              <p className="text-sm font-semibold text-text-primary text-center leading-tight">
                {partner.name}
              </p>
              <p className="text-xs text-text-secondary mt-0.5">{partner.category}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
