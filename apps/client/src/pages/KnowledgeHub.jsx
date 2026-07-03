import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import SectionHeading from '../components/shared/SectionHeading';
import FloatingDots from '../components/shared/FloatingDots';
import api from '../lib/axios';
import { Search, ArrowRight, Calendar, Tag } from 'lucide-react';

const categories = ['All', 'Research', 'Case Study', 'Impact Story', 'Policy Brief', 'Opinion'];

const categoryColors = {
  'Research': 'bg-primary-50 text-primary-600',
  'Case Study': 'bg-secondary-50 text-secondary-600',
  'Impact Story': 'bg-blue-50 text-blue-600',
  'Policy Brief': 'bg-red-50 text-red-500',
  'Opinion': 'bg-purple-50 text-purple-600',
};

export default function KnowledgeHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeCategory = searchParams.get('category') || 'All';

  useEffect(() => {
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
  }, []);

  const filtered = articles.filter((a) => {
    const matchCategory = activeCategory === 'All' || a.category === activeCategory;
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || (a.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
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
        <title>Knowledge Hub — RavivarVichar</title>
        <meta name="description" content="Explore research, case studies, impact stories, and policy briefs from RavivarVichar's work in rural development." />
      </Helmet>

      <PageLayout>
        <section className="relative overflow-hidden bg-surface-secondary py-24 lg:py-32">
          <FloatingDots />
          <div className="container-content relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-label">KNOWLEDGE HUB</span>
              <h1 className="text-hero-mobile lg:text-hero text-ink-primary mt-4 leading-tight">
                Insights & <span className="text-primary-500">Research</span>
              </h1>
              <p className="text-body text-ink-secondary mt-6 max-w-2xl mx-auto">
                Explore our library of research, case studies, impact stories, and policy recommendations driving evidence-based rural development.
              </p>
            </div>
            <div className="max-w-lg mx-auto mt-10">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-secondary" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search articles..." className="input-field pl-12" />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat ? 'bg-primary-500 text-white shadow-soft' : 'bg-white text-ink-secondary hover:text-primary-500 border border-gray-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section-md bg-surface-white">
          <div className="container-content">
            {loading ? (
              <div className="text-center py-16"><p className="text-lg text-ink-secondary">Loading articles...</p></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16"><p className="text-lg text-ink-secondary">No articles found. Try a different search or category.</p></div>
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
