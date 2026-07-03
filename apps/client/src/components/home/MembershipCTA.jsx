import { motion } from 'framer-motion';
import { UserPlus, ArrowRight } from 'lucide-react';
import Button from '../shared/Button';

export default function MembershipCTA() {
  return (
    <section className="section-lg bg-surface-white">
      <div className="container-site">
        <motion.div
          className="rounded-card bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-12 md:p-20 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.04]">
            <div className="w-full h-full rounded-full bg-primary-500" />
          </div>
          <div className="absolute bottom-0 left-0 w-48 h-48 opacity-[0.03]">
            <div className="w-full h-full rounded-full bg-secondary-500" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <UserPlus size={40} className="mx-auto text-primary-500 mb-6" />
            <h2 className="text-[32px] md:text-[40px] font-heading font-bold text-text-primary mb-4 leading-tight">
              Become a Member
            </h2>
            <p className="text-body text-text-secondary mb-8 max-w-lg mx-auto">
              Join our community of change-makers. Members gain access to research publications, program updates, and opportunities to collaborate on ground-level projects.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="primary" to="/membership" arrow>
                Join as Member
              </Button>
              <Button variant="secondary" to="/contact" arrow={false}>
                Volunteer With Us
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
