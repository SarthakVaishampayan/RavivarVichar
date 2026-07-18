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
    description: 'Helping women build, grow, and sustain successful businesses through knowledge, mentorship, market access, and partnerships.',
  },
  {
    slug: 'shgs',
    title: 'SHGs',
    icon: HeartHandshake,
    color: 'bg-secondary-50 text-secondary-500',
    description: 'Strengthening Self Help Groups through capacity building, financial inclusion, market linkages, and community-led development.',
  },
  {
    slug: 'financial-literacy',
    title: 'Financial Literacy & Economic Independence',
    icon: PiggyBank,
    color: 'bg-blue-50 text-blue-600',
    description: 'Promoting financial awareness, entrepreneurship, digital payments, government schemes, and sustainable livelihoods for women.',
  },
  {
    slug: 'leadership-skill-development',
    title: 'Leadership & Skill Development',
    icon: Award,
    color: 'bg-amber-50 text-amber-600',
    description: 'Equipping women and young leaders with the skills, confidence, and opportunities needed to lead businesses, communities, and institutions.',
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
