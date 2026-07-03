import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import Button from '../shared/Button';

export default function DonateCTA() {
  return (
    <section className="bg-surface-white">
      <div className="container-site pb-20 md:pb-30">
        <motion.div
          className="rounded-card bg-text-primary p-12 md:p-20 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary-500" />
            <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-primary-500" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <Heart size={40} className="mx-auto text-primary-400 mb-6" />
            <h2 className="text-[32px] md:text-[40px] font-heading font-bold text-white mb-4 leading-tight">
              Support Our Mission
            </h2>
            <p className="text-body text-gray-300 mb-8 max-w-lg mx-auto">
              Your donation helps us train women entrepreneurs, strengthen self-help groups, and produce research that drives policy change. Every contribution counts.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="primary" to="/donate" arrow>
                Donate Now
              </Button>
              <button className="btn-secondary !border-gray-600 !text-white hover:!bg-white/10">
                Other Ways to Give
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
