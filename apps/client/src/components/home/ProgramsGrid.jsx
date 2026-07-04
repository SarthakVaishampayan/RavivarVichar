import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeading from '../shared/SectionHeading';
import { ArrowRight, Users, Briefcase, BookOpen, Globe } from 'lucide-react';

const whatWeDoItems = [
  {
    slug: 'empowerment',
    title: 'Empowerment',
    icon: Users,
    color: 'bg-primary-50 text-primary-500',
    description: 'We empower rural women and marginalized communities through financial literacy, leadership training, and grassroots organizing, enabling them to take charge of their own development.',
  },
  {
    slug: 'entrepreneurship-support',
    title: 'Entrepreneurship Support',
    icon: Briefcase,
    color: 'bg-secondary-50 text-secondary-500',
    description: 'We provide mentorship, seed funding access, and market linkages to rural entrepreneurs, helping them launch and scale sustainable micro-enterprises.',
  },
  {
    slug: 'capacity-building',
    title: 'Capacity Building',
    icon: BookOpen,
    color: 'bg-blue-50 text-blue-600',
    description: 'Through workshops, training programs, and knowledge-sharing, we strengthen the skills and capabilities of community members and local institutions.',
  },
  {
    slug: 'ground-work',
    title: 'Ground Work',
    icon: Globe,
    color: 'bg-amber-50 text-amber-600',
    description: 'Our field teams work directly with communities on the ground — conducting surveys, facilitating SHG meetings, and implementing village-level development projects.',
  },
];

export default function ProgramsGrid() {
  return (
    <section className="section-lg bg-surface-white">
      <div className="container-site">
        <SectionHeading
          label="What We Do"
          title="Our Focus Areas"
          description="We drive change through four interconnected pillars of community development."
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
