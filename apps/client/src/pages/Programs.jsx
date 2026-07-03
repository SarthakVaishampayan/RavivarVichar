import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import SectionHeading from '../components/shared/SectionHeading';
import FloatingDots from '../components/shared/FloatingDots';
import Button from '../components/shared/Button';
import { GraduationCap, Users, BookOpen, ArrowRight, Leaf, Lightbulb, Heart } from 'lucide-react';

const programs = [
  {
    slug: 'women-entrepreneurs',
    title: 'Women Entrepreneurship',
    category: 'Entrepreneurship',
    description: 'Empowering rural women with business skills, microfinance access, and mentorship to start and grow sustainable enterprises.',
    image: null,
    icon: Lightbulb,
    stats: { trained: '2,500+', villages: '150', businesses: '800+' },
    color: 'primary',
  },
  {
    slug: 'shg-development',
    title: 'SHG Development',
    category: 'Community',
    description: 'Building and strengthening Self-Help Groups to foster financial independence, collective savings, and community leadership.',
    image: null,
    icon: Users,
    stats: { groups: '200+', members: '5,000+', savings: '₹2Cr+' },
    color: 'secondary',
  },
  {
    slug: 'financial-literacy',
    title: 'Financial Literacy',
    category: 'Education',
    description: 'Workshops and training programs on budgeting, savings, digital banking, and financial planning for rural communities.',
    image: null,
    icon: BookOpen,
    stats: { trained: '10,000+', workshops: '300+', districts: '8' },
    color: 'blue',
  },
  {
    slug: 'research-advocacy',
    title: 'Research & Advocacy',
    category: 'Research',
    description: 'Evidence-based research on rural development issues, producing policy recommendations and actionable insights.',
    image: null,
    icon: GraduationCap,
    stats: { reports: '45+', policies: '12', citations: '200+' },
    color: 'red',
  },
  {
    slug: 'livelihood-support',
    title: 'Livelihood Support',
    category: 'Livelihood',
    description: 'Skills training, market linkages, and resource support for sustainable agriculture and alternative livelihoods.',
    image: null,
    icon: Leaf,
    stats: { farmers: '3,000+', trades: '15', income_boost: '40%' },
    color: 'green',
  },
  {
    slug: 'health-wellness',
    title: 'Health & Wellness',
    category: 'Health',
    description: 'Community health awareness camps, nutrition programs, and access to basic healthcare services in remote villages.',
    image: null,
    icon: Heart,
    stats: { camps: '120+', beneficiaries: '15,000+', villages: '80' },
    color: 'red',
  },
];

const colorMap = {
  primary: 'bg-primary-100 text-primary-600',
  secondary: 'bg-secondary-100 text-secondary-600',
  blue: 'bg-blue-100 text-blue-600',
  red: 'bg-red-100 text-red-500',
  green: 'bg-green-100 text-green-600',
};

const iconBgMap = {
  primary: 'bg-primary-50 text-primary-500',
  secondary: 'bg-secondary-50 text-secondary-500',
  blue: 'bg-blue-50 text-blue-500',
  red: 'bg-red-50 text-red-500',
  green: 'bg-green-50 text-green-600',
};

export default function Programs() {
  return (
    <>
      <Helmet>
        <title>Programs — RavivarVichar</title>
        <meta name="description" content="Explore RavivarVichar's programs: Women Entrepreneurship, SHG Development, Financial Literacy, Research, Livelihood Support, and Health & Wellness." />
      </Helmet>

      <PageLayout>
        {/* Hero */}
        <section className="relative overflow-hidden bg-surface-secondary py-24 lg:py-32">
          <FloatingDots />
          <div className="container-content relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-label">OUR PROGRAMS</span>
              <h1 className="text-hero-mobile lg:text-hero text-ink-primary mt-4 leading-tight">
                Transforming Lives Through{' '}
                <span className="text-primary-500">Action</span>
              </h1>
              <p className="text-body text-ink-secondary mt-6 max-w-2xl mx-auto">
                Our programs are designed to address the root causes of rural poverty through a holistic, 
                community-driven approach that combines empowerment, education, and economic opportunity.
              </p>
            </div>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="section-md bg-surface-white">
          <div className="container-content">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program) => {
                const Icon = program.icon;
                return (
                  <Link
                    key={program.slug}
                    to={`/programs/${program.slug}`}
                    className="card-hover overflow-hidden group"
                  >
                    <div className="p-8">
                      <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${iconBgMap[program.color]} mb-5`}>
                        <Icon size={28} />
                      </div>
                      <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${colorMap[program.color]} mb-3`}>
                        {program.category}
                      </span>
                      <h3 className="text-card font-heading font-bold text-ink-primary group-hover:text-primary-500 transition-colors">
                        {program.title}
                      </h3>
                      <p className="text-body text-ink-secondary mt-3 line-clamp-3">
                        {program.description}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-100">
                        {Object.entries(program.stats).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-sm font-bold text-ink-primary">{value}</div>
                            <div className="text-xs text-ink-secondary capitalize">{key.replace('_', ' ')}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="px-8 pb-6">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 group-hover:gap-3 transition-all">
                        Learn More <ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-md bg-surface-section">
          <div className="container-content text-center">
            <h2 className="text-section-mobile lg:text-section text-ink-primary font-heading font-bold">
              Want to Partner With Us?
            </h2>
            <p className="text-body text-ink-secondary mt-4 max-w-xl mx-auto">
              We're always looking for partners who share our vision of rural empowerment. 
              Let's work together to create lasting impact.
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button variant="primary" to="/contact" arrow>Become a Partner</Button>
              <Button variant="secondary" to="/about">Learn About Us</Button>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
