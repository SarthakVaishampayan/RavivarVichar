import { motion } from 'framer-motion';
import SectionHeading from '../shared/SectionHeading';
import Button from '../shared/Button';
import Card from '../shared/Card';

const articles = [
  {
    title: 'How Rural Women Are Redefining Entrepreneurship in Rajasthan',
    description: 'A look at three women-led enterprises that emerged from our SHG network, transforming local economies one small business at a time.',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80',
    category: 'Case Study',
    date: '2025-12-15',
    author: 'RavivarVichar Team',
    to: '/knowledge-hub/rural-women-entrepreneurship-rajasthan',
  },
  {
    title: 'The State of Microfinance in India: 2026 Outlook',
    description: 'An analysis of current trends, challenges, and opportunities in India\'s microfinance sector with implications for rural development.',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80',
    category: 'Research',
    date: '2026-01-10',
    author: 'Dr. Ananya Rao',
    to: '/knowledge-hub/microfinance-india-2026-outlook',
  },
  {
    title: 'Explainer: What Is a Self-Help Group and How Does It Work?',
    description: 'A beginner-friendly guide to understanding SHGs — their structure, benefits, and role in rural financial inclusion.',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&q=80',
    category: 'Explainer',
    date: '2025-11-20',
    author: 'RavivarVichar Team',
    to: '/knowledge-hub/explainer-what-is-shg',
  },
];

export default function LatestArticles() {
  return (
    <section className="section-lg bg-surface-white">
      <div className="container-site">
        <SectionHeading
          label="Knowledge Hub"
          title="Latest Articles"
          description="Insights, case studies, and explainers from our work on the ground."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card
                image={article.image}
                category={article.category}
                title={article.title}
                description={article.description}
                date={article.date}
                author={article.author}
                to={article.to}
              />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Button variant="outline" to="/knowledge-hub" arrow>
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
}
