import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import FloatingDots from '../components/shared/FloatingDots';
import SectionHeading from '../components/shared/SectionHeading';
import Button from '../components/shared/Button';
import { ArrowLeft, Users, Briefcase, BookOpen, Globe, CheckCircle } from 'lucide-react';

const contentMap = {
  'empowerment': {
    title: 'Empowerment',
    icon: Users,
    color: 'text-primary-500',
    bgColor: 'bg-primary-50',
    heroDescription: 'We believe that true change begins when individuals and communities gain the confidence, knowledge, and agency to shape their own futures.',
    sections: [
      { heading: 'Financial Literacy', body: 'Training women in budgeting, saving, digital banking, and understanding credit. We conduct hands-on workshops that demystify finance and build lasting habits.' },
      { heading: 'Leadership Development', body: 'Identifying and nurturing community leaders through structured programs that build public speaking, negotiation, and organizational skills.' },
      { heading: 'Community Organizing', body: 'Facilitating the formation of self-help groups and community-based organizations that serve as platforms for collective action and mutual support.' },
    ],
    impact: ['5,000+ women trained in financial literacy', '200+ SHGs formed and active', '80% increase in savings behavior', '300+ community leaders identified'],
  },
  'entrepreneurship-support': {
    title: 'Entrepreneurship Support',
    icon: Briefcase,
    color: 'text-secondary-500',
    bgColor: 'bg-secondary-50',
    heroDescription: 'We provide rural entrepreneurs with the tools, capital, and networks they need to turn their ideas into sustainable businesses.',
    sections: [
      { heading: 'Mentorship & Training', body: 'Connecting aspiring entrepreneurs with experienced mentors who provide guidance on business planning, marketing, and operations.' },
      { heading: 'Access to Capital', body: 'Facilitating connections with microfinance institutions, banks, and government schemes to help entrepreneurs access the funding they need.' },
      { heading: 'Market Linkages', body: 'Building bridges between rural producers and urban markets, enabling entrepreneurs to reach wider audiences and get fair prices for their products.' },
    ],
    impact: ['800+ businesses launched', '2,500+ women trained', '₹5Cr+ in microfinance disbursed', '85% business survival rate after 2 years'],
  },
  'capacity-building': {
    title: 'Capacity Building',
    icon: BookOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    heroDescription: 'Strengthening the skills, knowledge, and capabilities of individuals and institutions to drive sustainable development from within.',
    sections: [
      { heading: 'Skill Development Workshops', body: 'Regular training programs covering digital literacy, bookkeeping, communication skills, and technical knowledge relevant to local livelihoods.' },
      { heading: 'Institutional Strengthening', body: 'Working with local NGOs, government bodies, and community organizations to improve their operational efficiency and program delivery.' },
      { heading: 'Knowledge Resources', body: 'Creating and distributing educational materials, toolkits, and research reports that empower communities with actionable information.' },
    ],
    impact: ['10,000+ individuals trained', '300+ workshops conducted', '8 districts covered', '60% digital payment adoption rate'],
  },
  'ground-work': {
    title: 'Ground Work',
    icon: Globe,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    heroDescription: 'Our field teams are the heart of our organization — working shoulder-to-shoulder with communities to implement programs that create real, measurable change.',
    sections: [
      { heading: 'Field Surveys & Research', body: 'Conducting community needs assessments, baseline surveys, and impact evaluations that inform our program design and policy recommendations.' },
      { heading: 'SHG Facilitation', body: 'Regular visits to self-help groups to provide handholding support, resolve challenges, and ensure groups are functioning effectively.' },
      { heading: 'Village-Level Implementation', body: 'On-the-ground execution of development projects — from organizing health camps to setting up community libraries and water conservation initiatives.' },
    ],
    impact: ['500+ villages reached', '50K+ lives impacted', '150+ village-level projects', '15+ years of grassroots presence'],
  },
};

export default function WhatWeDoDetail() {
  const { slug } = useParams();
  const content = contentMap[slug];

  if (!content) {
    return (
      <PageLayout>
        <div className="container-content py-32 text-center">
          <h1 className="text-3xl font-heading font-bold text-ink-primary">Section Not Found</h1>
          <p className="text-body text-ink-secondary mt-4">This focus area doesn't exist.</p>
          <Button variant="primary" to="/" className="mt-8">Back to Home</Button>
        </div>
      </PageLayout>
    );
  }

  const Icon = content.icon;

  return (
    <>
      <Helmet>
        <title>{content.title} — RavivarVichar</title>
        <meta name="description" content={content.heroDescription} />
      </Helmet>

      <PageLayout>
        <section className="relative overflow-hidden bg-surface-secondary py-24 lg:py-28">
          <FloatingDots />
          <div className="container-content relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-ink-secondary hover:text-primary-500 transition-colors mb-8">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <div className="max-w-3xl">
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${content.bgColor} ${content.color} mb-5`}>
                <Icon size={28} />
              </div>
              <h1 className="text-hero-mobile lg:text-hero text-ink-primary mt-4 leading-tight">{content.title}</h1>
              <p className="text-body text-ink-secondary mt-6 max-w-2xl">{content.heroDescription}</p>
            </div>
          </div>
        </section>

        <section className="section-md bg-surface-white">
          <div className="container-content">
            <SectionHeading
              label="WHAT WE DO"
              title={`Our Approach to ${content.title}`}
              description=""
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {content.sections.map((section, i) => (
                <div key={section.heading} className="card p-8 lg:p-10">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 text-primary-600 font-bold font-heading text-lg mb-5">
                    {i + 1}
                  </span>
                  <h3 className="text-xl font-heading font-bold text-ink-primary mb-4">{section.heading}</h3>
                  <p className="text-body text-ink-secondary">{section.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-md bg-surface-section">
          <div className="container-content">
            <SectionHeading
              label="IMPACT"
              title="Our Impact Numbers"
              description=""
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {content.impact.map((item) => (
                <div key={item} className="card p-6 flex items-start gap-4">
                  <CheckCircle size={20} className="text-primary-500 shrink-0 mt-0.5" />
                  <span className="text-body text-ink-secondary">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-md bg-primary-500 relative overflow-hidden text-center">
          <FloatingDots count={4} />
          <div className="container-content relative z-10">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white">
              Want to Support {content.title}?
            </h2>
            <p className="text-lg text-white/80 mt-4 max-w-xl mx-auto">
              Join us in our mission to empower rural communities.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Button variant="secondary" to="/join-our-initiative" arrow>Join Our Initiative</Button>
              <Button variant="outline" to="/partner-with-us" className="border-white text-white hover:bg-white hover:text-primary-500">Partner with Us</Button>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
