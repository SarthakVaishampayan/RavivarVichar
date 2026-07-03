import { motion } from 'framer-motion';
import { Users, Building2, BookOpen, Globe } from 'lucide-react';

const stats = [
  { icon: Users, value: '2,500+', label: 'Women Empowered' },
  { icon: Building2, value: '120+', label: 'SHGs Formed' },
  { icon: BookOpen, value: '85+', label: 'Research Reports' },
  { icon: Globe, value: '12', label: 'Districts Covered' },
];

export default function ImpactStats() {
  return (
    <section className="section-lg bg-surface-white">
      <div className="container-site">
        <div className="rounded-card bg-secondary-500 px-8 py-16 md:py-20 shadow-card relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-60 h-60 rounded-full bg-white" />
            <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white" />
          </div>

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Icon size={28} className="mx-auto text-white/80 mb-4" />
                  <p className="text-4xl md:text-5xl font-bold font-heading text-white mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-white/80 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
