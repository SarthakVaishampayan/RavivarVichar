import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { useInView } from 'framer-motion';
import PageLayout from '../components/layout/PageLayout';
import FloatingDots from '../components/shared/FloatingDots';
import SectionHeading from '../components/shared/SectionHeading';
import Button from '../components/shared/Button';
import { ArrowLeft, Briefcase, HeartHandshake, PiggyBank, Award, CheckCircle, Users } from 'lucide-react';

const iconMap = {
  Users,
  PiggyBank,
  Award,
  HeartHandshake,
  Briefcase,
};

const contentMap = {
  'women-entrepreneurship': {
    title: 'Women Entrepreneurship',
    icon: Briefcase,
    color: 'text-primary-500',
    bgColor: 'bg-primary-50',
    heroDescription: 'We support women in starting, strengthening, and growing their businesses. Our focus is on helping women move from ideas and informal livelihoods towards sustainable and independent enterprises. We work with women entrepreneurs, aspiring entrepreneurs, Self Help Groups, artisans, and grassroots businesses across different sectors.',
    sections: [
      { heading: 'Mentorship & Market Access', body: 'Connect women entrepreneurs with mentors, institutions, industry networks, and potential markets.' },
      { heading: 'Awareness & Opportunities', body: 'Create awareness about government schemes, funding opportunities, loans, grants, and entrepreneurship programmes.' },
      { heading: 'Networking & Collaboration', body: 'Facilitate networking and collaboration among women-led businesses.' },
      { heading: 'Visibility & Promotion', body: 'Promote women-owned businesses and help increase their visibility.' },
      { heading: 'Skill Development', body: 'Support skill development in areas such as branding, digital marketing, financial management, technology, and business growth.' },
      { heading: 'Partnerships', body: 'Build partnerships with chambers of commerce, corporates, NGOs, government bodies, and other institutions.' },
      { heading: 'Showcase Platforms', body: 'Create platforms where women entrepreneurs can showcase their work, products, and stories.' },
    ],
    impact: [
      { value: 1200, suffix: '+', label: 'Women Entrepreneurs Supported' },
      { value: 500, suffix: '+', label: 'Businesses Launched' },
      { value: 2, prefix: '₹', suffix: 'Cr+', label: 'Funding Facilitated' },
      { value: 85, suffix: '%', label: 'Business Sustainability Rate' },
    ],
    goal: 'To help more women move from earning a livelihood to building sustainable enterprises.',
    goalVision: 'We believe every woman has the potential to build a sustainable enterprise. Our mission is to remove barriers, create opportunities, and provide the support systems women need to thrive as entrepreneurs and community leaders.',
    goalPillars: [
      { icon: 'Users', heading: 'Mentorship & Networks', body: 'Connecting women with mentors, industry networks, and peer communities that fuel growth and open doors.' },
      { icon: 'PiggyBank', heading: 'Access & Awareness', body: 'Creating pathways to capital, government schemes, funding, and market opportunities for women-led businesses.' },
      { icon: 'Award', heading: 'Skills & Visibility', body: 'Building capabilities in branding, digital tools, financial management, and amplifying women-owned businesses.' },
    ],
  },
  'shgs': {
    title: 'SHGs',
    icon: HeartHandshake,
    color: 'text-secondary-500',
    bgColor: 'bg-secondary-50',
    heroDescription: 'We work with Self Help Groups as important engines of women\'s economic empowerment and community development. Our focus is not only on highlighting SHG stories, but on helping strengthen their visibility, knowledge, leadership, and access to opportunities.',
    sections: [
      { heading: 'Documentation & Amplification', body: 'Document and amplify successful SHG models and community-led initiatives.' },
      { heading: 'Market & Partner Connections', body: 'Connect SHGs with markets, institutions, brands, and potential partners.' },
      { heading: 'Capacity Building', body: 'Support capacity building in entrepreneurship, digital skills, financial literacy, leadership, and business management.' },
      { heading: 'Awareness & Opportunities', body: 'Create awareness about government schemes, support programmes, and market opportunities.' },
      { heading: 'Showcase & Visibility', body: 'Help showcase SHG products, businesses, and local enterprises.' },
      { heading: 'Network Facilitation', body: 'Facilitate connections between SHGs, entrepreneurs, NGOs, corporates, and government institutions.' },
      { heading: 'Knowledge Sharing', body: 'Promote knowledge-sharing between different communities and SHG networks.' },
    ],
    impact: [
      { value: 300, suffix: '+', label: 'SHGs Strengthened' },
      { value: 5000, suffix: '+', label: 'Women SHG Members' },
      { value: 150, prefix: '₹', suffix: 'L+', label: 'Group Savings' },
      { value: 90, suffix: '%', label: 'Loan Repayment Rate' },
    ],
    goal: 'To help Self Help Groups evolve from savings and credit collectives into stronger, sustainable, and market-connected community enterprises.',
    goalVision: 'We believe Self Help Groups are powerful engines of grassroots change. Our mission is to strengthen their capabilities, amplify their impact, and connect them to markets, networks, and opportunities that drive sustainable growth.',
    goalPillars: [
      { icon: 'Users', heading: 'Visibility & Storytelling', body: 'Documenting and amplifying SHG success stories, models, and community-led initiatives to inspire and inform.' },
      { icon: 'HeartHandshake', heading: 'Capacity & Connections', body: 'Building skills in entrepreneurship, digital literacy, and financial management while connecting SHGs to markets and partners.' },
      { icon: 'PiggyBank', heading: 'Markets & Growth', body: 'Creating pathways for SHG products and enterprises to reach wider markets, access funding, and achieve sustainability.' },
    ],
  },
  'financial-literacy': {
    title: 'Financial Literacy & Economic Independence',
    icon: PiggyBank,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    heroDescription: 'Economic independence begins with the ability to understand, manage, and control one\'s finances. We work to make financial knowledge more accessible to women and communities, particularly those who may not have easy access to formal financial education.',
    sections: [
      { heading: 'Financial Resources', body: 'Create simple and accessible resources on saving, budgeting, banking, credit, insurance, and digital payments.' },
      { heading: 'Scheme Awareness', body: 'Build awareness about government schemes, loans, grants, and financial support available to women.' },
      { heading: 'Business Finance', body: 'Promote understanding of business finances, pricing, bookkeeping, and cash flow.' },
      { heading: 'Banking Access', body: 'Encourage women to access formal banking and financial services.' },
      { heading: 'Digital Finance Education', body: 'Create educational content on digital financial tools and safe digital transactions.' },
      { heading: 'Institutional Connections', body: 'Connect women entrepreneurs and SHGs with relevant financial institutions and support networks.' },
      { heading: 'Financial Independence', body: 'Promote the importance of independent income and financial decision-making.' },
    ],
    impact: [
      { value: 8000, suffix: '+', label: 'Women Trained in Financial Literacy' },
      { value: 70, suffix: '%', label: 'Digital Payment Adoption' },
      { value: 200, suffix: '+', label: 'Bank Linkages Established' },
      { value: 40, suffix: '%', label: 'Increase in Household Savings' },
    ],
    goal: 'To help women make informed financial decisions, build independent incomes, and participate more confidently in the formal economy.',
    goalVision: 'We believe financial literacy is the foundation of economic independence. Our mission is to make financial knowledge accessible, practical, and actionable for every woman — enabling her to take control of her financial future.',
    goalPillars: [
      { icon: 'PiggyBank', heading: 'Knowledge & Resources', body: 'Creating simple, accessible resources on saving, budgeting, banking, credit, insurance, and digital payments tailored for women.' },
      { icon: 'Users', heading: 'Access & Inclusion', body: 'Building awareness of government schemes, banking services, and financial support while connecting women to formal financial systems.' },
      { icon: 'Award', heading: 'Income & Independence', body: 'Empowering women to understand business finances, build independent incomes, and make confident financial decisions.' },
    ],
  },
  'leadership-skill-development': {
    title: 'Leadership & Skill Development',
    icon: Award,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    heroDescription: 'Empowerment is not only about earning. It is also about having the confidence, skills, and opportunity to lead. We work to build the capabilities of women and young people so they can lead businesses, communities, institutions, and social change.',
    sections: [
      { heading: 'Training & Workshops', body: 'Organise training programmes, workshops, and learning initiatives that build practical skills and knowledge.' },
      { heading: 'Skill Building', body: 'Build skills in communication, leadership, entrepreneurship, digital technology, and business management.' },
      { heading: 'Mentorship & Expert Connect', body: 'Connect women with mentors, professionals, trainers, and industry experts who can guide and inspire them.' },
      { heading: 'Knowledge Sharing', body: 'Create opportunities for women to share their knowledge and experiences with peers and communities.' },
      { heading: 'Community Leadership', body: 'Support leadership development within communities and Self Help Groups to foster grassroots change.' },
      { heading: 'Peer Networks', body: 'Promote networking and peer-to-peer learning as powerful tools for growth and confidence building.' },
      { heading: 'Public Participation', body: 'Build platforms where women can participate in conversations, decision-making, and public life.' },
    ],
    impact: [
      { value: 2500, suffix: '+', label: 'Women Trained in Leadership' },
      { value: 400, suffix: '+', label: 'Community Leaders Identified' },
      { value: 150, suffix: '+', label: 'Youth Skill Workshops' },
      { value: 60, suffix: '%', label: 'Women in Leadership Roles' },
    ],
    goal: 'To equip women with the knowledge, skills, confidence, and networks needed to lead and create change.',
    goalVision: 'We believe leadership is not defined by position, but by the ability to inspire, influence, and create change. Our mission is to build a pipeline of women leaders who can drive transformation in their communities, businesses, and institutions.',
    goalPillars: [
      { icon: 'Award', heading: 'Training & Skill Building', body: 'Organising workshops, training programmes, and learning initiatives that build communication, leadership, entrepreneurship, and digital skills.' },
      { icon: 'Users', heading: 'Mentorship & Connections', body: 'Connecting women with mentors, professionals, trainers, and industry experts while promoting networking and peer-to-peer learning.' },
      { icon: 'HeartHandshake', heading: 'Platforms & Opportunities', body: 'Creating platforms for women to participate in conversations, decision-making, and public life while sharing their knowledge and experiences.' },
    ],
  },
};

function AnimatedCounter({ value, prefix = '', suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    let startTime = null;
    let animationFrame;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

export default function WhatWeDoDetail() {
  const [loaded, setLoaded] = useState(false);
  const { slug } = useParams();
  const content = contentMap[slug];

  useEffect(() => {
    const img = new Image();
    img.src = '/whatwedo-hero.jpg';
    img.onload = () => setLoaded(true);
  }, []);

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
        <title>{content.title} — Ravivar Vichar</title>
        <meta name="description" content={content.heroDescription} />
      <link rel="preload" as="image" href="/whatwedo-hero.jpg" />
      </Helmet>

      <PageLayout>
        <section className="relative min-h-[70vh] lg:min-h-[calc(100vh-90px)] flex items-start overflow-hidden max-lg:pt-[12vh] pt-[15vh]">
          {/* Background image */}
          <div className="absolute inset-0 bg-gray-900">
            <img
  src="/whatwedo-hero.jpg"
  alt=""
  onLoad={() => setLoaded(true)}
  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
    loaded ? 'opacity-100' : 'opacity-0'
  }`}
/>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(16,16,16,0.85) 0%, rgba(16,16,16,0.70) 35%, rgba(16,16,16,0.25) 70%, rgba(16,16,16,0.08) 100%)' }} />
          </div>
          {/* Content */}
          <div className="w-full relative z-10 max-lg:px-6 pl-[5vw]">
            <div className="max-w-[580px]">
              <Link to="/" className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors mb-8">
                <ArrowLeft size={16} /> Back to Home
              </Link>
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ${content.color} mb-5`}>
                <Icon size={28} />
              </div>
              <h1 className="text-3xl max-lg:text-hero-mobile lg:text-5xl text-white leading-[1.2]">{content.title}</h1>
              <p className="text-lg text-white/70 mt-6 leading-relaxed max-w-[550px]">{content.heroDescription}</p>
            </div>
          </div>
        </section>

        <section className="section-md bg-surface-white">
          <div className="container-content">
            <SectionHeading
              label="HOW WE DO IT"
              title={`How We Do It`}
              description=""
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {content.sections.map((section, i) => (
                <div
                  key={section.heading}
                  className={`card p-8 lg:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-hover group ${
                    i === content.sections.length - 1 && content.sections.length % 3 === 1 ? 'lg:col-start-2' : ''
                  }`}
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 text-primary-600 font-bold font-heading text-lg mb-5 group-hover:scale-110 group-hover:bg-primary-100 transition-all duration-300">
                    {i + 1}
                  </span>
                  <h3 className="text-xl font-heading font-bold text-ink-primary mb-4 group-hover:text-primary-600 transition-colors duration-300">{section.heading}</h3>
                  <p className="text-body text-ink-secondary group-hover:text-ink-primary transition-colors duration-300">{section.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {content.goal && (
          <section className="section-md bg-surface-white relative overflow-hidden">
            <div className="container-content">
              <SectionHeading
                label="OUR GOAL"
                title="What We Aim For"
                description=""
              />

              <div className="max-w-4xl mx-auto mt-12">
                <blockquote className="text-center relative">
                  <span className="text-6xl lg:text-8xl text-primary-200 absolute -top-8 -left-4 select-none">"</span>
                  <p className="text-2xl lg:text-3xl text-ink-primary leading-relaxed font-heading font-bold px-8">
                    {content.goal}
                  </p>
                  <span className="text-6xl lg:text-8xl text-primary-200 absolute -bottom-16 -right-4 select-none">"</span>
                </blockquote>

                {content.goalVision && (
                  <p className="text-center text-lg text-ink-secondary mt-8 max-w-3xl mx-auto leading-relaxed">
                    {content.goalVision}
                  </p>
                )}
              </div>

              {content.goalPillars && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 max-w-5xl mx-auto">
                  {content.goalPillars.map((pillar) => {
                    const PillarIcon = iconMap[pillar.icon] || Users;
                    return (
                      <div key={pillar.heading} className="card p-6 lg:p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-hover group">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 mb-5 group-hover:scale-110 transition-transform duration-300">
                          <PillarIcon size={28} />
                        </div>
                        <h4 className="text-lg font-heading font-bold text-ink-primary mb-2 group-hover:text-primary-600 transition-colors">{pillar.heading}</h4>
                        <p className="text-sm text-ink-secondary leading-relaxed">{pillar.body}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        <section className="section-md bg-surface-section">
          <div className="container-content">
            <SectionHeading
              label="IMPACT"
              title="Our Impact Numbers"
              description=""
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {content.impact.map((item) => (
                <div
                  key={item.label || item}
                  className="card p-6 lg:p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-hover group"
                >
                  {typeof item === 'object' ? (
                    <>
                      <div className="text-3xl lg:text-4xl font-bold font-heading text-primary-500">
                        <AnimatedCounter value={item.value} prefix={item.prefix || ''} suffix={item.suffix || ''} />
                      </div>
                      <p className="text-sm font-semibold text-ink-primary mt-2 group-hover:text-primary-600 transition-colors">
                        {item.label}
                      </p>
                    </>
                  ) : (
                    <div className="flex items-start gap-4">
                      <CheckCircle size={20} className="text-primary-500 shrink-0 mt-0.5" />
                      <span className="text-body text-ink-secondary text-left">{item}</span>
                    </div>
                  )}
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
              <Button variant="outline" to="/partner-with-us" className="border-white text-white hover:bg-white hover:text-primary-500">Partner With Us</Button>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
