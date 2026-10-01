import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FileText, Video, Globe } from 'lucide-react';

const stats = [
  {
    icon: FileText,
    end: 5000,
    suffix: '+',
    label: 'Published Stories & Reports',
    description: 'Ground reports, analytical articles & field investigations',
    color: 'text-primary-500',
    bgColor: 'bg-primary-50',
  },
  {
    icon: Video,
    end: 3000,
    suffix: '+',
    label: 'Video Documentaries Produced',
    description: 'Multimedia field stories, video reports & grassroots interviews',
    color: 'text-secondary-500',
    bgColor: 'bg-secondary-50',
  },
  {
    icon: Globe,
    end: 50,
    suffix: 'M+',
    label: 'Lifetime Digital Impressions',
    description: 'Multi-platform reach across Web, YouTube & social channels',
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
    <span ref={ref} className="tabular-nums font-numeric font-bold">
      {count.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

export default function ImpactStats({ bgClass = 'bg-surface-white' }) {
  return (
    <section className={`section-lg ${bgClass} section-separator relative overflow-hidden`}>
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
          <span className="section-label">EDITORIAL REACH</span>
          <h2 className="section-title">Documenting Grassroots Change</h2>
          <p className="section-desc">
            Quantifiable scale of our investigative reporting, documentary production, and digital readership across Central India.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={`group${i === stats.length - 1 ? ' col-span-2 lg:col-span-1' : ''}`}
              >
                <div className={`card-hover p-6 lg:p-8 text-center relative overflow-hidden${i === stats.length - 1 ? ' max-w-[calc((100%-1.25rem)/2)] mx-auto lg:max-w-none' : ''}`}>
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

        {/* Methodology Footnote */}
        <div className="text-center mt-10">
          <p className="text-xs text-ink-secondary/70 italic max-w-2xl mx-auto leading-relaxed">
            * Metrics reflect cumulative editorial publications, documentary video productions, and cross-platform readership across web, YouTube, and digital syndication since our digital transition.
          </p>
        </div>
      </div>
    </section>
  );
}
