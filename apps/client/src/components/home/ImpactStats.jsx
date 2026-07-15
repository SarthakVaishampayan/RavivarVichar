import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Heart, Building2, BookOpen } from 'lucide-react';

const stats = [
  {
    icon: Heart,
    end: 50000,
    suffix: '+',
    label: 'Lives Impacted',
    description: 'Across rural communities in Rajasthan',
    color: 'text-primary-500',
    bgColor: 'bg-primary-50',
  },
  {
    icon: Users,
    end: 5000,
    suffix: '+',
    label: 'Women Empowered',
    description: 'Through training and leadership programs',
    color: 'text-secondary-500',
    bgColor: 'bg-secondary-50',
  },
  {
    icon: Building2,
    end: 200,
    suffix: '+',
    label: 'SHGs Formed',
    description: 'Active self-help groups across districts',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: BookOpen,
    end: 500,
    suffix: '+',
    label: 'Villages Reached',
    description: 'On-the-ground programs and initiatives',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
];

function CountUp({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    let startTime = null;
    let animationFrame;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic for a decelerating animation
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

export default function ImpactStats() {
  return (
    <section className="section-lg bg-surface-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/3 h-px bg-gradient-to-r from-transparent via-secondary-200 to-transparent" />
      </div>

      <div className="container-site">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">OUR IMPACT</span>
          <h2 className="section-title">Making a Difference</h2>
          <p className="section-desc">
            Tangible outcomes from our programs and community initiatives across Rajasthan.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group"
              >
                <div className="card-hover p-6 lg:p-8 text-center relative overflow-hidden">
                  {/* Top accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bgColor} ${stat.color} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} />
                  </div>

                  <div className={`text-3xl lg:text-4xl font-bold font-heading ${stat.color}`}>
                    <CountUp end={stat.end} suffix={stat.suffix} />
                  </div>

                  <div className="mt-2">
                    <p className="text-sm font-semibold text-ink-primary">
                      {stat.label}
                    </p>
                    <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
