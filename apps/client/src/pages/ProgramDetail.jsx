import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/shared/Button';
import FloatingDots from '../components/shared/FloatingDots';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const programData = {
  'women-entrepreneurs': {
    title: 'Women Entrepreneurship',
    tagline: 'Empowering rural women to become business leaders',
    description: 'Our Women Entrepreneurship program provides comprehensive support for rural women to start, manage, and scale their own businesses. We combine skill development, financial access, and mentorship to create a nurturing ecosystem for women entrepreneurs.',
    impact: ['2,500+ women trained in business skills', '800+ businesses launched', '150 villages covered', '₹5Cr+ in microfinance disbursed', '85% business survival rate after 2 years'],
    approach: [
      { title: 'Skill Development', description: 'Training in business planning, financial management, marketing, and digital literacy.' },
      { title: 'Microfinance Access', description: 'Facilitating connections with microfinance institutions and self-help group savings.' },
      { title: 'Mentorship Network', description: 'Ongoing guidance from experienced entrepreneurs and business professionals.' },
      { title: 'Market Linkages', description: 'Connecting women entrepreneurs to local and regional markets for their products.' },
    ],
    stats: { trained: '2,500+', active: '800+', villages: '150', growth: '40%' },
    color: 'primary',
  },
  'shg-development': {
    title: 'SHG Development',
    tagline: 'Building self-reliant women\'s collectives',
    description: 'Our Self-Help Group development program focuses on forming and strengthening women\'s collectives that serve as platforms for savings, enterprise, and community leadership. We provide training, handholding support, and linkages to government schemes.',
    impact: ['200+ active SHGs', '5,000+ women members', '₹2Cr+ in collective savings', '80% financial literacy rate', '120+ SHGs linked to bank credit'],
    approach: [
      { title: 'Group Formation', description: 'Facilitating the formation of new SHGs with 10-15 members each.' },
      { title: 'Capacity Building', description: 'Training in bookkeeping, meeting management, conflict resolution, and leadership.' },
      { title: 'Financial Linkage', description: 'Connecting SHGs to banks, government schemes, and microfinance institutions.' },
      { title: 'Livelihood Promotion', description: 'Supporting SHG members in identifying and pursuing collective livelihood opportunities.' },
    ],
    stats: { groups: '200+', members: '5,000+', savings: '₹2Cr+', linked: '120+' },
    color: 'secondary',
  },
  'financial-literacy': {
    title: 'Financial Literacy',
    tagline: 'Building financial capability for better lives',
    description: 'Our Financial Literacy program equips rural communities with the knowledge and skills to make informed financial decisions. From basic budgeting to digital banking, we cover essential financial concepts in accessible, practical ways.',
    impact: ['10,000+ individuals trained', '300+ workshops conducted', '8 districts covered', '70% increase in savings behavior', '60% adoption of digital payments'],
    approach: [
      { title: 'Workshops & Camps', description: 'Interactive financial literacy camps covering budgeting, savings, and debt management.' },
      { title: 'Digital Banking Training', description: 'Hands-on training in mobile banking, UPI, and digital payment systems.' },
      { title: 'Family Finance Planning', description: 'Workshops on household budgeting, children\'s education savings, and emergency funds.' },
      { title: 'Entrepreneur Finance', description: 'Specialized modules for small business owners on cash flow, pricing, and record keeping.' },
    ],
    stats: { trained: '10,000+', workshops: '300+', districts: '8', digital: '60%' },
    color: 'blue',
  },
  'research-advocacy': {
    title: 'Research & Advocacy',
    tagline: 'Evidence-driven policy for rural development',
    description: 'Our Research & Advocacy wing produces rigorous, data-driven research on critical rural development issues. We translate findings into actionable policy recommendations and advocate for evidence-based decision-making at local, state, and national levels.',
    impact: ['45+ research reports published', '12 policy recommendations adopted', '200+ academic citations', '15 conferences presented', '5 policy briefs submitted'],
    approach: [
      { title: 'Field Research', description: 'Primary data collection from rural communities using mixed-method approaches.' },
      { title: 'Policy Analysis', description: 'Analyzing existing policies and their impact on rural livelihoods and development.' },
      { title: 'Advocacy Campaigns', description: 'Engaging with policymakers, media, and civil society to drive policy change.' },
      { title: 'Knowledge Dissemination', description: 'Publishing reports, briefs, and articles to share findings with stakeholders.' },
    ],
    stats: { reports: '45+', policies: '12', citations: '200+', conferences: '15' },
    color: 'red',
  },
  'livelihood-support': {
    title: 'Livelihood Support',
    tagline: 'Sustainable livelihoods for resilient communities',
    description: 'Our Livelihood Support program helps rural families diversify their income sources through skills training, market linkages, and sustainable agriculture practices. We focus on building resilience against climate shocks and economic uncertainties.',
    impact: ['3,000+ farmers supported', '15 trades introduced', '40% average income increase', '200+ market linkages', '25 farmer producer groups'],
    approach: [
      { title: 'Skills Training', description: 'Vocational training in trades like tailoring, handicrafts, food processing, and more.' },
      { title: 'Sustainable Agriculture', description: 'Promoting organic farming, water conservation, and climate-resilient practices.' },
      { title: 'Market Access', description: 'Creating direct market linkages and facilitating participation in local haats and fairs.' },
      { title: 'Value Addition', description: 'Training in product processing, packaging, and branding to increase income.' },
    ],
    stats: { farmers: '3,000+', trades: '15', income: '+40%', groups: '25' },
    color: 'green',
  },
  'health-wellness': {
    title: 'Health & Wellness',
    tagline: 'Healthy communities, thriving futures',
    description: 'Our Health & Wellness program addresses the healthcare gaps in remote rural areas through community health camps, nutrition awareness, and preventive care initiatives. We partner with local health departments and medical professionals.',
    impact: ['120+ health camps organized', '15,000+ beneficiaries', '80 villages covered', '90% vaccination awareness', '50 community health workers trained'],
    approach: [
      { title: 'Health Camps', description: 'Regular health check-up camps in remote villages with general and specialized services.' },
      { title: 'Nutrition Programs', description: 'Awareness programs on maternal and child nutrition, kitchen gardens, and balanced diets.' },
      { title: 'WASH Initiatives', description: 'Promoting water, sanitation, and hygiene practices through community workshops.' },
      { title: 'Health Worker Training', description: 'Training local women as community health workers for last-mile healthcare delivery.' },
    ],
    stats: { camps: '120+', beneficiaries: '15,000+', villages: '80', workers: '50' },
    color: 'red',
  },
};

const colorMap = {
  primary: { text: 'text-primary-500', bg: 'bg-primary-50', icon: 'text-primary-500 fill-primary-500' },
  secondary: { text: 'text-secondary-500', bg: 'bg-secondary-50', icon: 'text-secondary-500 fill-secondary-500' },
  blue: { text: 'text-blue-500', bg: 'bg-blue-50', icon: 'text-blue-500 fill-blue-500' },
  red: { text: 'text-red-500', bg: 'bg-red-50', icon: 'text-red-500 fill-red-500' },
  green: { text: 'text-green-600', bg: 'bg-green-50', icon: 'text-green-600 fill-green-600' },
};

export default function ProgramDetail() {
  const { slug } = useParams();
  const program = programData[slug];

  if (!program) {
    return (
      <PageLayout>
        <div className="container-content py-32 text-center">
          <h1 className="text-3xl font-heading font-bold text-ink-primary">Program Not Found</h1>
          <p className="text-body text-ink-secondary mt-4">The program you're looking for doesn't exist.</p>
          <Button variant="primary" to="/programs" className="mt-8">View All Programs</Button>
        </div>
      </PageLayout>
    );
  }

  const colors = colorMap[program.color];

  return (
    <>
      <Helmet>
        <title>{program.title} — RavivarVichar Programs</title>
        <meta name="description" content={program.tagline} />
      </Helmet>

      <PageLayout>
        {/* Hero */}
        <section className={`relative overflow-hidden ${colors.bg} py-24 lg:py-32`}>
          <FloatingDots />
          <div className="container-content relative z-10">
            <Link to="/programs" className="inline-flex items-center gap-2 text-sm font-medium text-ink-secondary hover:text-primary-500 transition-colors mb-8">
              <ArrowLeft size={16} /> Back to Programs
            </Link>
            <div className="max-w-3xl">
              <span className={`section-label ${colors.text}`}>{program.title}</span>
              <h1 className="text-hero-mobile lg:text-hero text-ink-primary mt-4 leading-tight">
                {program.tagline}
              </h1>
              <p className="text-body text-ink-secondary mt-6 max-w-2xl">
                {program.description}
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Button variant="primary" to="/donate" arrow>Support This Program</Button>
                <Button variant="secondary" to="/contact">Get Involved</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="section-sm bg-surface-white">
          <div className="container-content">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(program.stats).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className={`text-3xl lg:text-4xl font-bold font-heading ${colors.text}`}>{value}</div>
                  <div className="text-sm text-ink-secondary mt-1 capitalize">{key.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Approach */}
        <section className="section-md bg-surface-section">
          <div className="container-content">
            <div className="text-center mb-16">
              <span className={`section-label ${colors.text}`}>OUR APPROACH</span>
              <h2 className="text-section-mobile lg:text-section text-ink-primary font-heading font-bold mt-3">
                How We Make It Happen
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {program.approach.map((item, i) => (
                <div key={item.title} className="card-hover p-8 flex gap-5">
                  <div className={`shrink-0 h-10 w-10 rounded-xl ${colors.bg} flex items-center justify-center ${colors.text} font-bold text-lg`}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-heading text-ink-primary">{item.title}</h3>
                    <p className="text-body text-ink-secondary mt-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className="section-md bg-surface-white">
          <div className="container-content">
            <div className="text-center mb-16">
              <span className={`section-label ${colors.text}`}>OUR IMPACT</span>
              <h2 className="text-section-mobile lg:text-section text-ink-primary font-heading font-bold mt-3">
                Measurable Results
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {program.impact.map((item) => (
                <div key={item} className="flex items-start gap-4 p-5 rounded-card bg-surface-section">
                  <Check size={20} className={`shrink-0 mt-0.5 ${colors.text}`} />
                  <span className="text-body text-ink-primary">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={`section-md ${colors.bg} relative overflow-hidden`}>
          <FloatingDots />
          <div className="container-content relative z-10 text-center">
            <h2 className="text-section-mobile lg:text-section text-ink-primary font-heading font-bold">
              Ready to Make an Impact?
            </h2>
            <p className="text-body text-ink-secondary mt-4 max-w-xl mx-auto">
              Your support can help us expand this program to reach more communities.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Button variant="primary" to="/donate" arrow>Donate Now</Button>
              <Button variant="secondary" to="/contact">Volunteer With Us</Button>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
