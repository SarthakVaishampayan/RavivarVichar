import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import SectionHeading from '../components/shared/SectionHeading';
import FloatingDots from '../components/shared/FloatingDots';
import Button from '../components/shared/Button';
import { FileText, Download, Calendar, BookOpen, ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';

const reports = [
  { id: 1, title: 'State of Rural Entrepreneurship in Rajasthan 2025', category: 'Annual Report', date: 'Jan 2025', pages: 68, description: 'Comprehensive analysis of the rural entrepreneurship ecosystem in Rajasthan, with policy recommendations and success stories.', type: 'pdf' },
  { id: 2, title: 'Impact Assessment of SHGs on Women\'s Economic Empowerment', category: 'Research Report', date: 'Nov 2024', pages: 92, description: 'A five-year longitudinal study tracking the economic and social impact of Self-Help Groups on rural women.', type: 'pdf' },
  { id: 3, title: 'Climate Resilience in Semi-Arid Regions of India', category: 'Research Report', date: 'Aug 2024', pages: 74, description: 'Examining traditional and modern approaches to climate-resilient agriculture in drought-prone areas.', type: 'pdf' },
  { id: 4, title: 'Financial Inclusion Index: Rural Rajasthan', category: 'Policy Brief', date: 'Jun 2024', pages: 32, description: 'A district-level analysis of financial inclusion indicators with actionable policy recommendations.', type: 'pdf' },
  { id: 5, title: 'Health Outcomes of Community-Based Interventions', category: 'Research Report', date: 'Mar 2024', pages: 56, description: 'Analysis of health indicators before and after community health interventions in 50 villages.', type: 'pdf' },
  { id: 6, title: 'Annual Impact Report 2023-24', category: 'Annual Report', date: 'Apr 2024', pages: 40, description: 'A comprehensive overview of RavivarVichar\'s programs, impact metrics, and financial transparency.', type: 'pdf' },
];

export default function Research() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Annual Report', 'Research Report', 'Policy Brief'];
  const filtered = reports.filter((r) => {
    const matchCat = filter === 'All' || r.category === filter;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Helmet>
        <title>Research — RavivarVichar</title>
        <meta name="description" content="Access RavivarVichar's research reports, policy briefs, and impact assessments on rural development." />
      </Helmet>

      <PageLayout>
        {/* Hero */}
        <section className="relative overflow-hidden bg-surface-secondary py-24 lg:py-32">
          <FloatingDots />
          <div className="container-content relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-label">RESEARCH</span>
              <h1 className="text-hero-mobile lg:text-hero text-ink-primary mt-4 leading-tight">
                Evidence for{' '}
                <span className="text-primary-500">Change</span>
              </h1>
              <p className="text-body text-ink-secondary mt-6 max-w-2xl mx-auto">
                Our research produces rigorous, data-driven insights that inform policy, practice, and public 
                discourse on rural development in India.
              </p>
            </div>

            {/* Search */}
            <div className="max-w-md mx-auto mt-10">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-secondary" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reports..." className="input-field pl-12" />
              </div>
            </div>
          </div>
        </section>

        {/* Reports */}
        <section className="section-md bg-surface-white">
          <div className="container-content">
            {/* Filter */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setFilter(cat)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === cat ? 'bg-primary-500 text-white shadow-soft' : 'bg-white text-ink-secondary hover:text-primary-500 border border-gray-200'}`}>
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              {filtered.map((report) => (
                <div key={report.id} className="card-hover p-6 lg:p-8 flex flex-col lg:flex-row items-start gap-6">
                  <div className="shrink-0 h-16 w-16 rounded-2xl bg-primary-50 flex items-center justify-center">
                    <FileText size={28} className="text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-primary-50 text-primary-600 mb-2">{report.category}</span>
                    <h3 className="text-xl font-bold font-heading text-ink-primary">{report.title}</h3>
                    <p className="text-body text-ink-secondary mt-2">{report.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-ink-secondary">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {report.date}</span>
                      <span className="flex items-center gap-1"><BookOpen size={14} /> {report.pages} pages</span>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="shrink-0">
                    <Download size={16} /> Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-md bg-surface-section">
          <div className="container-content text-center">
            <h2 className="text-section-mobile lg:text-section text-ink-primary font-heading font-bold">Want to Collaborate on Research?</h2>
            <p className="text-body text-ink-secondary mt-4 max-w-xl mx-auto">We welcome research partnerships with academic institutions, think tanks, and policy organizations.</p>
            <Button variant="primary" to="/contact" className="mt-8" arrow>Get in Touch</Button>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
