import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';
import Button from '../shared/Button';

const projects = [
  {
    title: 'Marwar Livelihoods Project',
    district: 'Jodhpur',
    status: 'Ongoing',
    budget: '₹45 Lakhs',
    startDate: 'April 2025',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80',
    impacts: ['320 women trained', '28 SHGs formed'],
  },
  {
    title: 'Digital Literacy for SHGs',
    district: 'Udaipur',
    status: 'Completed',
    budget: '₹12 Lakhs',
    startDate: 'Jan 2024 – Dec 2024',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&q=80',
    impacts: ['540 women onboarded to UPI'],
  },
];

export default function CurrentProjects() {
  return (
    <section className="section-lg bg-surface-section">
      <div className="container-site">
        <SectionHeading
          label="Our Projects"
          title="Current & Completed Projects"
          description="Real projects making a tangible difference in rural communities."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="card-hover overflow-hidden group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className={`absolute top-4 right-4 rounded-full px-4 py-1.5 text-xs font-medium backdrop-blur-sm ${
                  project.status === 'Ongoing'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </div>
              <div className="p-8">
                <h3 className="text-card font-heading font-bold text-text-primary mb-4">
                  {project.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-5">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} />
                    {project.district}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={15} />
                    {project.startDate}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.impacts.map((impact) => (
                    <span
                      key={impact}
                      className="rounded-full bg-secondary-50 text-secondary-700 px-3 py-1 text-xs font-medium"
                    >
                      {impact}
                    </span>
                  ))}
                </div>
                <Button variant="outline" to="/projects" arrow className="text-sm py-2.5 px-5">
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Button variant="primary" to="/projects" arrow>
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
}
