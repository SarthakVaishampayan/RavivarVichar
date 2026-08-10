import { useState, useEffect } from 'react';
import HeroSlideshow from '../components/shared/HeroSlideshow';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/shared/Button';
import api from '../lib/axios';
import { ArrowLeft, ArrowRight, Calendar, Tag, Clock, Eye, Star } from 'lucide-react';

const sectionConfig = {
  'articles': { label: 'Articles', title: 'All Articles', description: 'Thought-provoking pieces on rural development, community stories, and sector analysis.' },
  'research-reports': { label: 'Research & Reports', title: 'All Research & Reports', description: 'In-depth studies and policy recommendations grounded in field research across Rajasthan.' },
  'success-stories': { label: 'Success Stories', title: 'All Success Stories', description: 'Inspiring journeys of individuals and communities transforming their lives through our programs.' },
};

const sectionCategoryMap = {
  'Articles': ['General', 'Case Study', 'Explainer', 'News', 'Opinion', 'Impact Story', 'Policy Brief'],
  'Research & Reports': ['Research'],
  'Success Stories': ['Success Stories'],
};

const categoryColors = {
  'Research': 'bg-primary-50 text-primary-600',
  'Case Study': 'bg-secondary-50 text-secondary-600',
  'Impact Story': 'bg-blue-50 text-blue-600',
  'Policy Brief': 'bg-red-50 text-red-500',
  'Opinion': 'bg-purple-50 text-purple-600',
  'Success Stories': 'bg-emerald-50 text-emerald-600',
  'Interview': 'bg-amber-50 text-amber-600',
};

export default function ArticlesSection() {
  const { sectionId } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);



  const config = sectionConfig[sectionId];

  useEffect(() => {
    if (!config) return;
    const fetchArticles = async () => {
      try {
        const { data } = await api.get('/articles', { params: { status: 'published', limit: 50, sort: '-createdAt' } });
        setArticles(data.data || []);
      } catch (err) {
        console.error('Failed to fetch articles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [config]);

  if (!config) {
    return (
      <PageLayout>
        <div className="container-content py-32 text-center">
          <h1 className="text-3xl font-heading font-bold text-ink-primary">Section Not Found</h1>
          <p className="text-body text-ink-secondary mt-4">This section doesn't exist.</p>
          <Button variant="primary" to="/articles" className="mt-8">Back to Articles</Button>
        </div>
      </PageLayout>
    );
  }

  const allowedCategories = sectionCategoryMap[config.label];
  const sectionArticles = articles.filter((a) =>
    // Positive allowlist: each section only shows its own categories
    allowedCategories.includes(a.category)
  );
  // Featured articles float to the top
  const filtered = [...sectionArticles.filter((a) => a.featured), ...sectionArticles.filter((a) => !a.featured)];

  const getReadingTime = (content) => {
    if (!content) return 1;
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>{config.title} — Ravivar Vichar</title>
        <meta name="description" content={config.description} />
      <link rel="preload" as="image" href="/articles-hero.jpg" />
      </Helmet>

      <PageLayout>
        <section className="relative min-h-[70vh] lg:min-h-[calc(100vh-90px)] flex items-center overflow-hidden max-md:items-start max-md:pt-[12vh] lg:items-start lg:pt-[25vh]">
          {/* Rotating hero background (gallery of all hero images) */}
          <HeroSlideshow startIndex={3} />
          {/* Content */}
          <div className="w-full relative z-10 max-lg:px-6 pl-[5vw]">
            <div className="max-w-[580px]">
              <Link to="/articles" className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors mb-8">
                <ArrowLeft size={16} /> Back to Articles
              </Link>
              <span className="text-sm font-semibold tracking-[0.15em] text-white/70 uppercase block mb-5">{config.label.toUpperCase().replace(' & ', ' & ')}</span>
              <h1 className="text-3xl max-lg:text-hero-mobile lg:text-5xl text-white leading-[1.2]">
                {config.title}
              </h1>
              <p className="text-lg text-white/70 mt-6 leading-relaxed max-w-[550px]">
                {config.description}
              </p>
            </div>
          </div>
        </section>

        <section className="section-md bg-surface-white">
          <div className="container-content">
            {loading ? (
              <div className="text-center py-16"><p className="text-lg text-ink-secondary">Loading {config.label.toLowerCase()}...</p></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-ink-secondary">No {config.label.toLowerCase()} published yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((article) => (
                  <Link
                    key={article._id}
                    to={`/articles/${article.slug}`}
                    className="card-hover overflow-hidden group"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                      {article.thumbnail ? (
                        <img src={article.thumbnail} alt={article.title} loading="lazy" className="w-full h-full object-cover" />
                      ) : (
                        <Tag size={28} className="text-primary-400" />
                      )}
                      {article.featured && (
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-primary-500 text-white text-[11px] font-semibold px-3 py-1 shadow-soft">
                          <Star size={12} /> Featured
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[article.category] || 'bg-gray-100 text-gray-600'} mb-3`}>
                        {article.category}
                      </span>
                      <h3 className="text-card font-heading font-bold text-ink-primary group-hover:text-primary-500 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-ink-secondary mt-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 text-xs text-ink-secondary">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} /> {formatDate(article.publishedAt || article.createdAt)}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1" title="Reading time">
                            <Clock size={13} /> {getReadingTime(article.content)} min read
                          </span>
                          <span className="flex items-center gap-1" title="Views">
                            <Eye size={13} /> {article.views || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 pb-6">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 group-hover:gap-3 transition-all">
                        Read More <ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </PageLayout>
    </>
  );
}
