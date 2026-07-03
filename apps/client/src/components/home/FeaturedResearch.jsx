import { motion } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';
import Button from '../shared/Button';

const researchItems = [
  {
    title: 'Impact of SHG-Bank Linkage on Rural Household Income',
    summary: 'An empirical study across 12 districts in Rajasthan showing a 22% average income increase post SHG-bank linkage, with the strongest effects among women-led households.',
    author: 'Dr. Ananya Rao',
    year: 2025,
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80',
    tags: ['Policy Brief', 'SHG', 'Financial Inclusion'],
  },
  {
    title: 'Digital Literacy & Financial Inclusion in Rural Rajasthan',
    summary: 'Examining the impact of UPI-based training programs on financial autonomy among rural women, with recommendations for scaling digital inclusion initiatives.',
    author: 'RavivarVichar Research Team',
    year: 2025,
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80',
    tags: ['Research', 'Digital Literacy', 'Women'],
  },
];

export default function FeaturedResearch() {
  return (
    <section className="section-lg bg-surface-section">
      <div className="container-site">
        <SectionHeading
          label="Research Centre"
          title="Our Latest Research"
          description="Evidence-based insights driving our programs and policy recommendations."
        />

        <div className="space-y-20">
          {researchItems.map((item, i) => (
            <motion.div
              key={item.title}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7 }}
            >
              {/* Image */}
              <div className={`${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="img-card overflow-hidden shadow-card">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary-50 text-primary-600 px-3 py-1 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-[32px] font-heading font-bold text-text-primary leading-tight mb-4">
                  {item.title}
                </h3>
                <p className="text-body text-text-secondary mb-6">
                  {item.summary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-text-secondary">
                    <span className="font-medium">{item.author}</span>
                    <span className="mx-2">·</span>
                    <span>{item.year}</span>
                  </div>
                  <Button variant="outline" to="/research" arrow className="text-sm py-2 px-5">
                    Read Report
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button variant="primary" to="/research" arrow>
            View All Research
          </Button>
        </div>
      </div>
    </section>
  );
}
