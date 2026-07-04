import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import SectionHeading from '../components/shared/SectionHeading';
import FloatingDots from '../components/shared/FloatingDots';
import api from '../lib/axios';
import { Search, ArrowRight, Calendar, Tag } from 'lucide-react';

const sections = [
  { id: 'articles', label: 'Articles' },
  { id: 'research-reports', label: 'Research & Reports' },
  { id: 'success-stories', label: 'Success Stories' },
  { id: 'interviews', label: 'Interviews' },
];

// Maps each section to the article categories it should show
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

const sectionHeadings = {
  'Articles': { label: 'ARTICLES', title: 'Latest Articles & Insights', description: 'Thought-provoking pieces on rural development, community stories, and sector analysis.' },
  'Research & Reports': { label: 'RESEARCH & REPORTS', title: 'Data-Driven Research', description: 'In-depth studies and policy recommendations grounded in field research across Rajasthan.' },
  'Success Stories': { label: 'SUCCESS STORIES', title: 'Real Stories, Real Impact', description: 'Inspiring journeys of individuals and communities transforming their lives through our programs.' },
  'Interviews': { label: 'INTERVIEWS', title: 'Conversations That Matter', description: 'Exclusive interviews with community leaders, experts, and changemakers in rural development.' },
};

export default function KnowledgeHub() {
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
    return articles.filter((a) => {
      const matchSection = sectionLabel === 'Articles'
        ? !sectionCategoryMap['Research & Reports'].includes(a.category) &&
          !sectionCategoryMap['Success Stories'].includes(a.category) &&
          !sectionCategoryMap['Interviews'].includes(a.category)
        : allowedCategories.includes(a.category);
      const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || (a.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchSection && matchSearch;
    });
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
        <title>Knowledge Hub — RavivarVichar</title>
        <meta name="description" content="Explore research, case studies, impact stories, and policy briefs from RavivarVichar's work in rural development." />
      </Helmet>

      <PageLayout>
        {/* Hero */}
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
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-secondary" />                  <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="input-field pl-12"
                />
              </div>
            </div>
            {/* Section Tab Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeSection === section.label
                      ? 'bg-primary-500 text-white shadow-soft'
                      : 'bg-white text-ink-secondary hover:text-primary-500 border border-gray-200'
                  }`}
                >
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
                className="section-md bg-surface-white scroll-mt-[110px]"
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
                      {filtered.length > 3 && (
                        <div className="text-center mt-10">
                          <Link
                            to={`/knowledge-hub/section/${section.id}`}
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
