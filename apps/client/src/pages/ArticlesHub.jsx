import { useState, useEffect } from 'react';
import HeroSlideshow from '../components/shared/HeroSlideshow';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import SectionHeading from '../components/shared/SectionHeading';
import api from '../lib/axios';
import { Search, ArrowRight, Calendar, Tag, FileText, BarChart3, Star, Clock, Eye } from 'lucide-react';

const sections = [
  { id: 'articles', label: 'Articles', icon: FileText },
  { id: 'research-reports', label: 'Research & Reports', icon: BarChart3 },
  { id: 'success-stories', label: 'Success Stories', icon: Star },
];

// Maps each section to the article categories it should show.
// 'Articles' is the unified content type; the legacy categories below are
// kept so older content that pre-dates the consolidation stays visible.
const sectionCategoryMap = {
  'Articles': ['Articles', 'General', 'Case Study', 'Explainer', 'News', 'Opinion', 'Impact Story', 'Policy Brief'],
  'Research & Reports': ['Research'],
  'Success Stories': ['Success Stories'],
};

const categoryColors = {
  'Articles': 'bg-slate-100 text-slate-700',
  'Research': 'bg-primary-50 text-primary-600',
  'Case Study': 'bg-secondary-50 text-secondary-600',
  'Impact Story': 'bg-blue-50 text-blue-600',
  'Policy Brief': 'bg-red-50 text-red-500',
  'Opinion': 'bg-purple-50 text-purple-600',
  'Success Stories': 'bg-emerald-50 text-emerald-600',
  'Interview': 'bg-amber-50 text-amber-600',
};

const sectionHeadings = {
  'Articles': { label: 'ARTICLES', title: 'Latest Articles & Insights', description: 'Thought-provoking pieces on rural development, community stories, and sector analysis.' },
  'Research & Reports': { label: 'RESEARCH & REPORTS', title: 'Data-Driven Research', description: 'In-depth studies and policy recommendations grounded in field research across Rajasthan.' },
  'Success Stories': { label: 'SUCCESS STORIES', title: 'Real Stories, Real Impact', description: 'Inspiring journeys of individuals and communities transforming their lives through our programs.' },
};

export default function ArticlesHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('Articles');
  const location = useLocation();



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

  // Handle hash on page load for scroll-to-section
  useEffect(() => {
    if (!loading && location.hash) {
      const id = location.hash.replace('#', '');
      const section = sections.find((s) => s.id === id);
      if (section) {
        setActiveSection(section.label);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.hash, loading]);

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const section = sections.find((s) => s.id === sectionId);
      if (section) setActiveSection(section.label);
    }
  };

  const getFilteredArticles = (sectionLabel) => {
    const allowedCategories = sectionCategoryMap[sectionLabel];
    const filtered = articles.filter((a) => {
      // Positive allowlist: each section only shows its own categories
      const matchSection = allowedCategories.includes(a.category);
      const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || (a.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchSection && matchSearch;
    });
    // Featured articles float to the top of their section
    return [...filtered.filter((a) => a.featured), ...filtered.filter((a) => !a.featured)];
  };

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
        <title>Articles — Ravivar Vichar</title>
        <meta name="description" content="Explore articles, research, and impact stories from Ravivar Vichar's work in rural development." />
      <link rel="preload" as="image" href="/articles-hero.jpg" />
      </Helmet>

      <PageLayout>
        {/* Hero */}
        <section className="relative min-h-[70vh] lg:min-h-[calc(100vh-90px)] flex items-center overflow-hidden max-md:items-start max-md:pt-[12vh] lg:items-start lg:pt-[35vh]">
          {/* Rotating hero background (gallery of all hero images) */}
          <HeroSlideshow startIndex={3} imageClass="object-[65%_center]" />
          {/* Content */}
          <div className="w-full relative z-10 max-lg:px-6 pl-[5vw]">
            <div className="max-w-[580px]">
              <span className="text-sm font-semibold tracking-[0.15em] text-white/70 uppercase inline-block mb-5">ARTICLES</span>
              <h1 className="text-3xl max-lg:text-hero-mobile lg:text-5xl text-white leading-[1.2]">
                Insights & <span className="text-primary-500">Research</span>
              </h1>
              <p className="text-lg text-white/70 mt-6 leading-relaxed max-w-[550px]">
                Explore our library of articles, research, impact stories, and policy recommendations driving evidence-based rural development.
              </p>
            </div>
          </div>
        </section>

        {/* Search & Section Tabs (Below Hero) */}
        <section className="bg-surface-white py-12 border-b border-gray-100">
          <div className="container-content">
            <div className="max-w-lg mx-auto">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-secondary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="input-field pl-12"
                />
              </div>
            </div>
            <div className="max-sm:overflow-x-auto max-sm:flex-nowrap max-sm:justify-start max-sm:pb-2 flex flex-wrap items-center justify-center gap-3 mt-6">
              {sections.map((section) => (                  <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`max-lg:shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeSection === section.label
                      ? 'bg-primary-500 text-white shadow-soft'
                      : 'bg-white text-ink-secondary hover:text-primary-500 border border-gray-200'
                  }`}
                >
                  {section.icon && <section.icon size={16} />}
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* All 4 Sections Stacked Vertically */}
        {loading ? (
          <section className="section-md bg-surface-white">
            <div className="container-content text-center py-16">
              <p className="text-lg text-ink-secondary">Loading articles...</p>
            </div>
          </section>
        ) : (
          sections.map((section) => {
            const filtered = getFilteredArticles(section.label);
            const heading = sectionHeadings[section.label];
            return (
              <section
                key={section.id}
                id={section.id}
                className="section-md bg-surface-white section-separator scroll-mt-[110px]"
              >
                <div className="container-content">
                  <SectionHeading
                    label={heading.label}
                    title={heading.title}
                    description={heading.description}
                  />

                  {filtered.length === 0 ? (
                    <p className="text-center text-ink-secondary mt-10">
                      {searchQuery
                        ? `No ${section.label.toLowerCase()} match your search.`
                        : `No ${section.label.toLowerCase()} published yet.`}
                    </p>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                        {filtered.slice(0, 3).map((article) => (
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
                      {filtered.length > 3 && (
                        <div className="text-center mt-10">
                          <Link
                            to={`/articles/section/${section.id}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors border border-primary-200 hover:border-primary-300 px-6 py-3 rounded-full"
                          >
                            More {section.label} <ArrowRight size={16} />
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </section>
            );
          })
        )}
      </PageLayout>
    </>
  );
}
