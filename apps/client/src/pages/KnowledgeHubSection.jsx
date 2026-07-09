import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/shared/Button';
import api from '../lib/axios';
import { ArrowLeft, ArrowRight, Calendar, Tag } from 'lucide-react';

const sectionConfig = {
  'articles': { label: 'Articles', title: 'All Articles', description: 'Thought-provoking pieces on rural development, community stories, and sector analysis.' },
  'research-reports': { label: 'Research & Reports', title: 'All Research & Reports', description: 'In-depth studies and policy recommendations grounded in field research across Rajasthan.' },
  'success-stories': { label: 'Success Stories', title: 'All Success Stories', description: 'Inspiring journeys of individuals and communities transforming their lives through our programs.' },
  'interviews': { label: 'Interviews', title: 'All Interviews', description: 'Exclusive interviews with community leaders, experts, and changemakers in rural development.' },
};

const sectionCategoryMap = {
  'Articles': ['General', 'Case Study', 'Explainer', 'News', 'Opinion'],
  'Research & Reports': ['Research'],
  'Success Stories': ['Success Stories'],
  'Interviews': ['Interview'],
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

export default function KnowledgeHubSection() {
  const [loaded, setLoaded] = useState(false);
  const { sectionId } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = '/articles-hero.jpg';
    img.onload = () => setLoaded(true);
  }, []);

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
          <p className="text-body text-ink-secondary mt-4">This knowledge hub section doesn't exist.</p>
          <Button variant="primary" to="/knowledge-hub" className="mt-8">Back to Knowledge Hub</Button>
        </div>
      </PageLayout>
    );
  }

  const allowedCategories = sectionCategoryMap[config.label];
  const filtered = articles.filter((a) => {
    if (config.label === 'Articles') {
      return !sectionCategoryMap['Research & Reports'].includes(a.category) &&
             !sectionCategoryMap['Success Stories'].includes(a.category) &&
             !sectionCategoryMap['Interviews'].includes(a.category);
    }
    return allowedCategories.includes(a.category);
  });

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
        <section className="relative min-h-[70vh] lg:min-h-[calc(100vh-90px)] flex items-start overflow-hidden pt-[25vh]">
          {/* Background image */}
          <div className="absolute inset-0 bg-gray-900">
            <img
  src="/articles-hero.jpg"
  alt=""
  onLoad={() => setLoaded(true)}
  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
    loaded ? 'opacity-100' : 'opacity-0'
  }`}
/>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(16,16,16,0.85) 0%, rgba(16,16,16,0.70) 35%, rgba(16,16,16,0.25) 70%, rgba(16,16,16,0.08) 100%)' }} />
          </div>
          {/* Content */}
          <div className="w-full relative z-10 pl-[5vw]">
            <div className="max-w-[580px]">
              <Link to="/knowledge-hub" className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors mb-8">
                <ArrowLeft size={16} /> Back to Knowledge Hub
              </Link>
              <span className="text-sm font-semibold tracking-[0.15em] text-white/70 uppercase block mb-5">{config.label.toUpperCase().replace(' & ', ' & ')}</span>
              <h1 className="text-3xl lg:text-5xl text-white leading-[1.2]">
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
                    to={`/knowledge-hub/${article.slug}`}
                    className="card-hover overflow-hidden group"
                  >
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                      {article.thumbnail ? (
                        <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
                      ) : (
                        <Tag size={28} className="text-primary-400" />
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
