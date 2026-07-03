import { motion } from 'framer-motion';
import SectionHeading from '../shared/SectionHeading';
import Button from '../shared/Button';
import Card from '../shared/Card';

const programs = [
  {
    title: 'Women Entrepreneurs Program',
    description: 'Supporting rural women to launch and scale micro-enterprises through mentorship, seed funding, and market access.',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80',
    category: 'Entrepreneurship',
    to: '/programs/women-entrepreneurs',
  },
  {
    title: 'SHG Development Initiative',
    description: 'Strengthening Self-Help Groups through capacity building, financial literacy, and bank linkage support.',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&q=80',
    category: 'Community',
    to: '/programs/shg-development',
  },
  {
    title: 'Financial Literacy Workshops',
    description: 'Community workshops on savings, credit, digital banking, and financial planning for rural families.',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80',
    category: 'Education',
    to: '/programs/financial-literacy',
  },
];

export default function ProgramsGrid() {
  return (
    <section className="section-lg bg-surface-white">
      <div className="container-site">
        <SectionHeading
          label="Our Programs"
          title="What We Do"
          description="We design and deliver programs that create lasting impact in rural communities across Rajasthan."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, i) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card
                image={program.image}
                category={program.category}
                title={program.title}
                description={program.description}
                to={program.to}
              />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Button variant="outline" to="/programs" arrow>
            View All Programs
          </Button>
        </div>
      </div>
    </section>
  );
}
