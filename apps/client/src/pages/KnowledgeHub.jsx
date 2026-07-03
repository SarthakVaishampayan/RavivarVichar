import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import SectionHeading from '../components/shared/SectionHeading';
import FloatingDots from '../components/shared/FloatingDots';
import { Search, ArrowRight, Calendar, User, Clock, Tag } from 'lucide-react';
import { useState } from 'react';

const categories = ['All', 'Research', 'Case Study', 'Impact Story', 'Policy Brief', 'Opinion'];

const articles = [
  { slug: 'impact-of-shgs-on-rural-women', title: 'The Impact of Self-Help Groups on Rural Women\'s Economic Empowerment', excerpt: 'A comprehensive study analyzing the economic and social impact of SHGs on rural women in Rajasthan over a five-year period.', category: 'Research', author: 'Dr. Priya Sharma', date: 'Mar 15, 2025', readTime: '8 min read', image: null },
  { slug: 'digital-literacy-transforming-villages', title: 'How Digital Literacy is Transforming Rural Entrepreneurship', excerpt: 'Exploring the role of digital skills in enabling rural entrepreneurs to access markets, manage finances, and grow their businesses.', category: 'Impact Story', author: 'Anita Verma', date: 'Feb 28, 2025', readTime: '6 min read', image: null },
  { slug: 'policy-recommendations-rural-finance', title: 'Policy Recommendations for Strengthening Rural Financial Inclusion', excerpt: 'Evidence-based policy recommendations for improving access to financial services in underserved rural areas.', category: 'Policy Brief', author: 'Rajesh Meena', date: 'Feb 10, 2025', readTime: '10 min read', image: null },
  { slug: 'women-entrepreneurs-rajasthan', title: 'From Home to Enterprise: Women Entrepreneurs of Rajasthan', excerpt: 'Case studies of women who transformed their small home-based businesses into thriving enterprises with community support.', category: 'Case Study', author: 'Dr. Priya Sharma', date: 'Jan 25, 2025', readTime: '12 min read', image: null },
  { slug: 'climate-resilient-agriculture', title: 'Climate-Resilient Agriculture: Lessons from Rural Rajasthan', excerpt: 'Examining traditional and modern approaches to climate-resilient farming practices in drought-prone regions.', category: 'Research', author: 'Vikram Singh', date: 'Jan 12, 2025', readTime: '7 min read', image: null },
  { slug: 'future-rural-development', title: 'The Future of Rural Development: A Community-Led Approach', excerpt: 'Why community-led development is the most effective path to sustainable rural transformation.', category: 'Opinion', author: 'Dr. Priya Sharma', date: 'Dec 20, 2024', readTime: '5 min read', image: null },
  { slug: 'shg-success-story-bhilwara', title: 'From Savings to Success: An SHG Story from Bhilwara', excerpt: 'How a group of 12 women turned their collective savings into a thriving community enterprise.', category: 'Case Study', author: 'Anita Verma', date: 'Dec 5, 2024', readTime: '8 min read', image: null },
  { slug: 'health-outcomes-rural-interventions', title: 'Health Outcomes of Community-Based Interventions in Rural India', excerpt: 'Analysis of health indicators before and after community health interventions in 50 villages.', category: 'Research', author: 'Rajesh Meena', date: 'Nov 18, 2024', readTime: '9 min read', image: null },
  { slug: 'mentorship-impact-entrepreneurship', title: 'Why Mentorship Matters in Rural Entrepreneurship', excerpt: 'The measurable impact of mentorship programs on business survival and growth rates for rural entrepreneurs.', category: 'Impact Story', author: 'Dr. Priya Sharma', date: 'Nov 2, 2024', readTime: '6 min read', image: null },
];

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
  const activeCategory = searchParams.get('category') || 'All';

  const filtered = articles.filter((a) => {
    const matchCategory = activeCategory === 'All' || a.category === activeCategory;
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

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
                Insights &{' '}
                <span className="text-primary-500">Research</span>
              </h1>
              <p className="text-body text-ink-secondary mt-6 max-w-2xl mx-auto">
                Explore our library of research, case studies, impact stories, and policy recommendations 
                driving evidence-based rural development.
              </p>
            </div>

            {/* Search */}
            <div className="max-w-lg mx-auto mt-10">
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

            {/* Categories */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-primary-500 text-white shadow-soft'
                      : 'bg-white text-ink-secondary hover:text-primary-500 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="section-md bg-surface-white">
          <div className="container-content">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-ink-secondary">No articles found. Try a different search or category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((article) => (
                  <Link
                    key={article.slug}
                    to={`/knowledge-hub/${article.slug}`}
                    className="card-hover overflow-hidden group"
                  >
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-2xl bg-white shadow-soft flex items-center justify-center">
                        <Tag size={28} className="text-primary-400" />
                      </div>
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
                      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100 text-xs text-ink-secondary">
                        <span className="flex items-center gap-1.5">
                          <User size={14} /> {article.author}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} /> {article.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} /> {article.readTime}
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
