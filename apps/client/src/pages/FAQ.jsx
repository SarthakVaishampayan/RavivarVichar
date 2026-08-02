import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import SectionHeading from '../components/shared/SectionHeading';
import { ChevronDown, Search, ArrowLeft, Building2, Briefcase, Handshake, BookOpen, Link2, Sparkles, Heart } from 'lucide-react';

const allFaqs = [
  {
    q: 'What is Ravivar Vichar?',
    a: 'Ravivar Vichar is a social impact organisation working to empower women through entrepreneurship, knowledge, leadership, capacity building, and community-driven action. We connect women, Self Help Groups, entrepreneurs, institutions, and partners with opportunities and resources that foster economic independence and lasting social impact.',
    category: 'About Us',
  },
  {
    q: 'Who does Ravivar Vichar work with?',
    a: 'We work with women entrepreneurs, aspiring entrepreneurs, Self Help Groups, rural communities, young people, institutions, NGOs, businesses, government bodies, and other organisations working towards inclusive development.',
    category: 'About Us',
  },
  {
    q: 'What are Ravivar Vichar\'s main focus areas?',
    a: 'Our core focus areas are: Women Entrepreneurship, Self Help Groups and Community Development, Financial Literacy and Economic Independence, and Leadership and Skill Development. Our work also includes research, knowledge-building, partnerships, and market access.',
    category: 'About Us',
  },
  {
    q: 'How does Ravivar Vichar help women entrepreneurs?',
    a: 'We connect women entrepreneurs with knowledge, mentorship, networks, market opportunities, training, institutional partnerships, and information about relevant schemes and support systems.',
    category: 'Entrepreneurship',
  },
  {
    q: 'How can an SHG work with Ravivar Vichar?',
    a: 'Self Help Groups can connect with us for capacity building, training, knowledge resources, market linkages, partnerships, storytelling, and participation in relevant programmes and initiatives.',
    category: 'SHGs & Communities',
  },
  {
    q: 'Does Ravivar Vichar provide funding or loans?',
    a: 'Ravivar Vichar does not directly provide loans or funding in every case. However, we work to connect women and community enterprises with relevant institutions, schemes, financial resources, and opportunities wherever possible.',
    category: 'Support',
  },
  {
    q: 'How can I become part of the Ravivar Vichar network?',
    a: 'You can participate as a woman entrepreneur, SHG member, mentor, volunteer, trainer, institutional partner, or organisation. Explore the relevant section on our website or contact us to find the best way to get involved.',
    category: 'Get Involved',
  },
  {
    q: 'How can I partner with Ravivar Vichar?',
    a: 'Organisations, businesses, NGOs, government bodies, CSR teams, educational institutions, and industry networks can partner with us through programmes, training, research, market access, funding, mentorship, and community initiatives.',
    category: 'Partnerships',
  },
  {
    q: 'How can my organisation collaborate with Ravivar Vichar?',
    a: 'You can collaborate with us through: CSR partnerships, Capacity-building programmes, Research, Mentorship, Training, Market linkages, Community development, Knowledge partnerships, and Events and campaigns.',
    category: 'Partnerships',
  },
  {
    q: 'Does Ravivar Vichar work only with rural women?',
    a: 'No. While rural communities and grassroots development are an important part of our work, we work with women and communities across different backgrounds, including entrepreneurs, SHGs, professionals, students, and institutions.',
    category: 'About Us',
  },
  {
    q: 'Does Ravivar Vichar conduct training programmes?',
    a: 'Yes. Our learning and capacity-building initiatives include workshops, masterclasses, training programmes, mentorship opportunities, and practical resources focused on entrepreneurship, financial literacy, leadership, digital skills, and business development.',
    category: 'Programmes',
  },
  {
    q: 'Can I feature my business or initiative on Ravivar Vichar?',
    a: 'Women entrepreneurs, SHGs, grassroots organisations, and social impact initiatives may be considered for features, case studies, interviews, and other forms of storytelling based on relevance and editorial or organisational criteria.',
    category: 'Get Involved',
  },
  {
    q: 'Does Ravivar Vichar conduct research?',
    a: 'Yes. Research and knowledge-building are important parts of our work. We aim to produce and share research, reports, case studies, policy insights, and practical knowledge related to women\'s entrepreneurship, livelihoods, SHGs, financial inclusion, and community development.',
    category: 'Programmes',
  },
  {
    q: 'How can I volunteer with Ravivar Vichar?',
    a: 'You can express your interest through our volunteer form. Opportunities may include research, communication, documentation, events, community engagement, and other areas depending on our ongoing initiatives.',
    category: 'Get Involved',
  },
  {
    q: 'How can I support Ravivar Vichar\'s work?',
    a: 'You can support our work by partnering with us, volunteering, mentoring, sharing opportunities, supporting programmes, collaborating on research, or helping connect women and communities with relevant resources.',
    category: 'Support',
  },
  {
    q: 'What makes Ravivar Vichar different?',
    a: 'Ravivar Vichar brings together knowledge, community, entrepreneurship, partnerships, and action. We do not only talk about women\'s empowerment — we work to create the connections, capabilities, and opportunities that can help women build greater economic independence and stronger communities.',
    category: 'About Us',
  },
];

const categoryOrder = [
  'About Us',
  'Entrepreneurship',
  'SHGs & Communities',
  'Programmes',
  'Partnerships',
  'Get Involved',
  'Support',
];

const categoryIcons = {
  'About Us': Building2,
  'Entrepreneurship': Briefcase,
  'SHGs & Communities': Handshake,
  'Programmes': BookOpen,
  'Partnerships': Link2,
  'Get Involved': Sparkles,
  'Support': Heart,
};

export default function FAQ() {
  const [loaded, setLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/contact-hero.jpg';
    img.onload = () => setLoaded(true);
  }, []);

  const groupedFaqs = categoryOrder.reduce((acc, cat) => {
    const items = allFaqs.filter(
      (faq) =>
        faq.category === cat &&
        (faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  const categories = activeCategory === 'All'
    ? Object.keys(groupedFaqs)
    : [activeCategory];

  const toggleFaq = (q) => {
    setOpenFaq((prev) => (prev === q ? null : q));
  };

  return (
    <>
      <Helmet>
        <title>FAQ — Ravivar Vichar</title>
        <meta name="description" content="Frequently asked questions about Ravivar Vichar — our work, partnerships, volunteering, and how to get involved." />
      </Helmet>

      <PageLayout>
        {/* Hero */}
        <section className="relative min-h-[60vh] lg:min-h-[calc(100vh-90px)] flex items-center overflow-hidden max-md:items-start max-md:pt-[12vh] lg:items-start lg:pt-[30vh]">
          <div className="absolute inset-0 bg-gray-900">
            <img
              src="/contact-hero.jpg"
              alt="FAQ"
              onLoad={() => setLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(16,16,16,0.85) 0%, rgba(16,16,16,0.70) 35%, rgba(16,16,16,0.25) 70%, rgba(16,16,16,0.08) 100%)' }} />
          </div>
          <div className="w-full relative z-10 max-lg:px-6 pl-[5vw]">
            <div className="max-w-[580px]">
              <Link to="/contact" className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors mb-8">
                <ArrowLeft size={16} /> Back to Contact
              </Link>
              <span className="text-sm font-semibold tracking-[0.15em] text-white/70 uppercase inline-block mb-5">FAQ</span>
              <h1 className="text-3xl max-lg:text-hero-mobile lg:text-5xl text-white leading-[1.2]">
                Frequently Asked <span className="text-primary-500">Questions</span>
              </h1>
              <p className="text-lg text-white/70 mt-6 leading-relaxed max-w-[550px]">
                Everything you need to know about Ravivar Vichar — our mission, how to get involved, partner with us, or support our work.
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="bg-surface-white py-12 border-b border-gray-100 sticky top-0 z-20">
          <div className="container-content">
            <div className="max-w-lg mx-auto">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-secondary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search FAQs..."
                  className="input-field pl-12"
                />
              </div>
            </div>
            <div className="max-lg:overflow-x-auto max-lg:flex-nowrap max-lg:justify-start max-lg:pb-2 flex flex-wrap items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setActiveCategory('All')}
                className={`max-lg:shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === 'All'
                    ? 'bg-primary-500 text-white shadow-soft'
                    : 'bg-white text-ink-secondary hover:text-primary-500 border border-gray-200'
                }`}
              >
                All
              </button>
              {categoryOrder.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`max-lg:shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-primary-500 text-white shadow-soft'
                      : 'bg-white text-ink-secondary hover:text-primary-500 border border-gray-200'
                  }`}
                >
                  {(() => { const Icon = categoryIcons[cat]; return <Icon size={16} />; })()}
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="section-md bg-surface-section">
          <div className="container-content">
            {categories.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-ink-secondary">No FAQs match your search.</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="mt-4 text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-12">
                {categories.map((cat) => (
                  <div key={cat}>
                    <div className="flex items-center gap-3 mb-6">
                      {(() => { const Icon = categoryIcons[cat]; return <Icon size={24} className="text-primary-500" />; })()}
                      <div>
                        <h2 className="text-xl font-heading font-bold text-ink-primary">{cat}</h2>
                        <p className="text-sm text-ink-secondary">
                          {groupedFaqs[cat].length} {groupedFaqs[cat].length === 1 ? 'question' : 'questions'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {groupedFaqs[cat].map((faq) => (
                        <div
                          key={faq.q}
                          className={`card overflow-hidden transition-all duration-300 ${
                            openFaq === faq.q
                              ? 'ring-1 ring-primary-200 shadow-soft'
                              : 'hover:shadow-sm'
                          }`}
                        >
                          <button
                            onClick={() => toggleFaq(faq.q)}
                            className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4"
                          >
                            <span className="text-base md:text-lg font-semibold text-ink-primary pr-4">
                              {faq.q}
                            </span>
                            <span
                              className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-50 text-primary-500 transition-all duration-300 ${
                                openFaq === faq.q ? 'rotate-180 bg-primary-500 text-white' : ''
                              }`}
                            >
                              <ChevronDown size={18} />
                            </span>
                          </button>
                          <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${
                              openFaq === faq.q ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className="px-5 md:px-6 pb-5 md:pb-6 text-body text-ink-secondary leading-relaxed border-t border-gray-100 pt-4">
                              {faq.a}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="section-md bg-surface-white">
          <div className="container-content text-center">
            <SectionHeading
              label="STILL HAVE QUESTIONS?"
              title="We're Here to Help"
              description="Can't find what you're looking for? Reach out to us directly and we'll get back to you."
            />
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition-colors shadow-soft hover:shadow-lg"
              >
                Contact Us
              </Link>
              <Link
                to="/partner-with-us"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-ink-secondary font-semibold text-sm hover:border-primary-200 hover:text-primary-500 transition-colors"
              >
                Partner With Us
              </Link>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
