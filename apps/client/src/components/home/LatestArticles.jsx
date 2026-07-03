import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../shared/SectionHeading';
import Button from '../shared/Button';
import Card from '../shared/Card';
import api from '../../lib/axios';

export default function LatestArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await api.get('/articles', { params: { status: 'published', limit: 3, sort: '-createdAt' } });
        setArticles(data.data || []);
      } catch (err) {
        console.error('Failed to fetch articles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <section className="section-lg bg-surface-white">
      <div className="container-site">
        <SectionHeading
          label="Knowledge Hub"
          title="Latest Articles"
          description="Insights, case studies, and explainers from our work on the ground."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(loading ? [] : articles).map((article, i) => (
            <motion.div
              key={article._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card
                image={article.thumbnail}
                category={article.category}
                title={article.title}
                description={article.excerpt}
                date={article.publishedAt || article.createdAt}
                author={article.author?.name || 'RavivarVichar Team'}
                to={`/knowledge-hub/${article.slug}`}
              />
            </motion.div>
          ))}
          {!loading && articles.length === 0 && (
            <div className="col-span-3 text-center py-12 text-ink-secondary">
              <p>No articles published yet. Check back soon!</p>
            </div>
          )}
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
