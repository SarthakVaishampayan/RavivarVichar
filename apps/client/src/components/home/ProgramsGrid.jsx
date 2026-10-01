import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeading from '../shared/SectionHeading';
import { ArrowRight, Briefcase, HeartHandshake, PiggyBank, Award } from 'lucide-react';

const whatWeDoItems = [
  {
    slug: 'women-entrepreneurship',
    title: 'Women Entrepreneurship',
    icon: Briefcase,
    color: 'bg-primary-50 text-primary-500',
    description: 'Documenting and amplifying the journeys of women transitioning from informal livelihoods to resilient, independent enterprises.',
  },
  {
    slug: 'shgs',
    title: 'Self Help Groups (SHGs)',
    icon: HeartHandshake,
    color: 'bg-secondary-50 text-secondary-500',
    description: 'Field reporting on rural credit collectives, community-led enterprises, and the transformative impact of SHG federations.',
  },
  {
    slug: 'financial-literacy',
    title: 'Financial Literacy & Inclusion',
    icon: PiggyBank,
    color: 'bg-blue-50 text-blue-600',
    description: 'Demystifying banking, digital payments, government welfare schemes, and economic rights for grassroots communities.',
  },
  {
    slug: 'leadership-skill-development',
    title: 'Leadership & Community Voices',
    icon: Award,
    color: 'bg-amber-50 text-amber-600',
    description: 'Spotlighting women panchayat leaders, rural innovators, and youth pioneers reshaping grassroots governance and society.',
  },
];

export default function ProgramsGrid({ bgClass = 'bg-surface-white' }) {
  return (
    <section className={`section-lg ${bgClass} section-separator`}>
      <div className="container-site">
        <SectionHeading
          label="EDITORIAL FOCUS"
          title="What We Cover"
          description="Investigative reporting and documentary storytelling across four core pillars of grassroots empowerment."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {whatWeDoItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to={`/what-we-do/${item.slug}`}
                  className="card-hover p-8 lg:p-10 flex flex-col h-full group"
                >
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.color} mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-ink-primary mb-4">{item.title}</h3>
                  <p className="text-body text-ink-secondary flex-1">{item.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary-500 group-hover:gap-3 transition-all">
                    Learn More <ArrowRight size={16} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
