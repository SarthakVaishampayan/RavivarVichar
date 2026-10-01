import { useState, useEffect, useRef } from 'react';
import HeroSlideshow from '../components/shared/HeroSlideshow';
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
    heroDescription:
      'We document, investigate, and amplify the stories of women building independent enterprises. Our editorial coverage chronicles the transition from informal livelihoods to sustainable, thriving businesses across grassroots India.',
    sections: {
      intro:
        'Our journalism delves deep into the realities of women entrepreneurs. We examine the barriers they navigate, spotlight innovative grassroots business models, and demystify government schemes, market linkages, and institutional support systems to inform and empower our readership.',
      items: [
        {
          heading: 'Field Reporting & Entrepreneur Profiles',
          body: 'We conduct on-the-ground interviews and write detailed profiles of women entrepreneurs, documenting their operational strategies, financial resilience, and lessons learned to inspire peers and inform policymakers.',
        },
        {
          heading: 'Scheme & Policy Analysis',
          body: 'We investigate government grants, micro-credit programs, and public subsidies, publishing accessible, analytical explainers that show how women can navigate and claim available resources.',
        },
        {
          heading: 'Market Access & Value Chains',
          body: 'We report on supply chain bottlenecks, digital marketplace adoption, and direct-to-consumer models, highlighting how rural and small-town enterprises are reaching wider audiences.',
        },
        {
          heading: 'Grassroots Visibility & Amplification',
          body: 'We provide nationwide media visibility to women-led micro-enterprises and artisan clusters, bringing their innovations to the attention of institutions, consumers, and potential partners.',
        },
        {
          heading: 'Digital & Financial Tools Journalism',
          body: 'We publish actionable guides on digital payments, inventory tracking, brand building, and formal credit, bridging information gaps for first-generation women business owners.',
        },
        {
          heading: 'Ecosystem & Institutional Dialogue',
          body: 'We facilitate informed public discourse by engaging chambers of commerce, developmental agencies, and industry leaders in discussions on removing structural barriers for female founders.',
        },
        {
          heading: 'Documentary Storytelling',
          body: 'Our multimedia reporting team produces high-impact video documentaries showcasing the grit and triumph of women navigating competitive markets from remote corners of the country.',
        },
      ],
    },
    impact: [
      { value: 450, suffix: '+', label: 'Entrepreneurs Profiled' },
      { value: 85, suffix: '+', label: 'Field Video Reports' },
      { value: 25, suffix: '+', label: 'States & UTs Covered' },
    ],
    goal: 'To document, inspire, and advocate for an economic environment where every woman can build a thriving enterprise.',
    goalVision:
      'We believe rigorous journalism has the power to shift narratives and drive policy reform. Our mission is to shine a relentless spotlight on women-led enterprises and the structural changes needed to support their long-term growth.',
    goalPillars: [
      {
        icon: 'Users',
        heading: 'In-Depth Storytelling',
        body: 'Highlighting unsung entrepreneurs and sharing practical roadmaps of grassroots business success.',
      },
      {
        icon: 'PiggyBank',
        heading: 'Policy & Scheme Insights',
        body: 'Translating complex economic policies and financial schemes into actionable ground-level reporting.',
      },
      {
        icon: 'Award',
        heading: 'Public Discourse & Advocacy',
        body: 'Fostering informed dialogues between policymakers, financial institutions, and grassroots business leaders.',
      },
    ],
  },
  'shgs': {
    title: 'Self Help Groups (SHGs)',
    icon: HeartHandshake,
    color: 'text-secondary-500',
    bgColor: 'bg-secondary-50',
    heroDescription:
      'Self Help Groups are the backbone of rural economic transformation. We provide exhaustive, on-the-ground reporting on SHG federations, collective enterprise, and community leadership across Central India.',
    sections: {
      intro:
        'Our coverage of Self Help Groups goes beyond superficial accounts. We report on the financial mechanics, collective decision-making, and systemic challenges of SHG federations, giving voice to millions of women transforming their local economies.',
      items: [
        {
          heading: 'Grassroots Documentation & Case Studies',
          body: 'We travel to village panchayats to chronicle how women-led savings groups evolve into thriving producer companies and resilient community institutions.',
        },
        {
          heading: 'Credit Linkage & Banking Investigations',
          body: 'We investigate banking accessibility, credit delivery rates, and interest burdens, bringing transparency to how formal finance serves grassroots collectives.',
        },
        {
          heading: 'Showcasing Community Enterprises',
          body: 'We spotlight indigenous handicrafts, agricultural value-addition, and local manufacturing spearheaded by SHG collectives across Central India.',
        },
        {
          heading: 'Amplifying Rural Federation Leaders',
          body: 'We give women federation leaders a prominent media platform to share systemic hurdles, best practices, and policy recommendations directly with national audiences.',
        },
        {
          heading: 'Cross-Regional Knowledge Exchange',
          body: 'We produce comparative reports showcasing innovative SHG governance models across different states to foster cross-pollination of community ideas.',
        },
        {
          heading: 'Documenting Institutional Partnerships',
          body: 'We analyze the intersection of government livelihoods missions, CSR collaborations, and grassroots SHGs to highlight what works and where gaps persist.',
        },
      ],
    },
    impact: [
      { value: 500, suffix: '+', label: 'SHG Collectives Documented' },
      { value: 15000, suffix: '+', label: 'Women Voices Amplified' },
      { value: 120, suffix: '+', label: 'In-Depth Case Studies' },
    ],
    goal: 'To chronicle and champion the evolution of Self Help Groups into formidable economic and social institutions.',
    goalVision:
      'SHGs represent one of the world\'s largest collective empowerment movements. Our mission is to ensure their achievements, challenges, and insights receive serious, persistent journalistic scrutiny and celebration.',
    goalPillars: [
      {
        icon: 'Users',
        heading: 'Field Investigations',
        body: 'Ground-truthing government initiatives and chronicling real-world impact across village clusters.',
      },
      {
        icon: 'HeartHandshake',
        heading: 'Collective Visibility',
        body: 'Giving national prominence to artisan collectives and rural producer enterprises.',
      },
      {
        icon: 'PiggyBank',
        heading: 'Policy & Credit Focus',
        body: 'Scrutinizing financial delivery systems to advocate for equitable rural banking access.',
      },
    ],
  },
  'financial-literacy': {
    title: 'Financial Literacy & Economic Independence',
    icon: PiggyBank,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    heroDescription:
      'Economic independence begins with financial autonomy and rights awareness. We produce investigative reports, explainer guides, and field stories on banking access, digital finance safety, and welfare schemes.',
    sections: {
      intro:
        'Financial systems can be intimidating without transparent information. Through investigative articles, explainer guides, and video tutorials, we break down banking protocols, credit access, and digital payments for women striving for self-reliance.',
      items: [
        {
          heading: 'Demystifying Banking & Credit',
          body: 'We publish clear, accessible explainers on formal banking procedures, interest calculations, credit scores, collateral rights, and insurance products.',
        },
        {
          heading: 'Digital Finance Safety & Cyber Hygiene',
          body: 'We educate our readership on digital payment safety, UPI transactions, fraud prevention, and navigating the digital economy with security.',
        },
        {
          heading: 'Welfare Scheme Navigators',
          body: 'We track, analyze, and report on state and central welfare schemes, detailing eligibility criteria, documentation checklists, and application workflows.',
        },
        {
          heading: 'Business Finance Journalism',
          body: 'We report on pricing strategies, working capital management, and cash flow fundamentals tailored for grassroots entrepreneurs and small businesses.',
        },
        {
          heading: 'Investigating Predatory Lending',
          body: 'We shine a light on informal debt traps, high-interest microloans, and fraudulent investment schemes to protect vulnerable rural communities.',
        },
        {
          heading: 'Economic Autonomy Narratives',
          body: 'We share real-life case studies of women who broke cycles of financial dependency to achieve independent asset ownership and financial dignity.',
        },
      ],
    },
    impact: [
      { value: 200, suffix: '+', label: 'Financial Explainers Published' },
      { value: 50, suffix: 'K+', label: 'Readers Reached Monthly' },
      { value: 40, suffix: '+', label: 'Welfare Schemes Analyzed' },
    ],
    goal: 'To equip every reader with the critical knowledge needed to manage finances safely, independently, and confidently.',
    goalVision:
      'Information is the first step toward economic freedom. We strive to eliminate information asymmetry so women and rural communities can participate equally and safely in the formal financial system.',
    goalPillars: [
      {
        icon: 'PiggyBank',
        heading: 'Clear Financial Guides',
        body: 'Translating complex banking regulations and financial products into simple, accessible language.',
      },
      {
        icon: 'Users',
        heading: 'Digital Safety Awareness',
        body: 'Investigating financial fraud and equipping readers with preventative cyber hygiene practices.',
      },
      {
        icon: 'Award',
        heading: 'Financial Autonomy Stories',
        body: 'Chronicling inspiring journeys of women achieving independent income and asset ownership.',
      },
    ],
  },
  'leadership-skill-development': {
    title: 'Leadership & Community Voices',
    icon: Award,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    heroDescription:
      'Empowerment is incomplete without the agency to lead and govern. We chronicle the journeys of grassroots women and youth rising into positions of influence across panchayats, community institutions, and social enterprise.',
    sections: {
      intro:
        'Leadership flourishes in village halls, community meetings, and agricultural cooperatives. We provide dedicated coverage to the changemakers challenging social norms, demanding administrative accountability, and steering grassroots governance.',
      items: [
        {
          heading: 'Panchayat & Local Governance Reporting',
          body: 'We profile women Sarpanches, ward members, and local administrators who are transforming village governance, education, and public sanitation.',
        },
        {
          heading: 'Youth Innovators & Changemakers',
          body: 'We report on young pioneers leveraging technology, education, and social enterprise to solve community bottlenecks in rural India.',
        },
        {
          heading: 'Systemic Barriers & Gender Discourse',
          body: 'We investigate the patriarchal norms, administrative resistance, and cultural barriers women overcome to assert their leadership.',
        },
        {
          heading: 'Thought Leadership & Podcasts',
          body: 'We host in-depth video interviews and podcast discussions where grassroots leaders engage directly with civil society experts and policymakers.',
        },
        {
          heading: 'Grassroots Best Practices',
          body: 'We document innovative community mobilization methods, conflict resolution strategies, and collaborative development models.',
        },
        {
          heading: 'Amplifying Unheard Perspectives',
          body: 'We serve as a national sounding board for grassroots women whose achievements and governance innovations deserve wider recognition.',
        },
      ],
    },
    impact: [
      { value: 350, suffix: '+', label: 'Grassroots Leaders Profiled' },
      { value: 120, suffix: '+', label: 'Documentary Video Episodes' },
      { value: 55, suffix: '+', label: 'Districts Covered in MP & CG' },
    ],
    goal: 'To document, celebrate, and amplify the voices of grassroots leaders who are transforming communities from within.',
    goalVision:
      'Every village and community has leaders whose courage reshapes society. Our journalistic mission is to ensure their leadership is documented, celebrated, and preserved in the public record.',
    goalPillars: [
      {
        icon: 'Award',
        heading: 'Leadership Profiling',
        body: 'Documenting individual courage, governance reforms, and transformative community initiatives.',
      },
      {
        icon: 'Users',
        heading: 'Policy & Structural Reporting',
        body: 'Examining the social and policy structures that impact female leadership in local governance.',
      },
      {
        icon: 'HeartHandshake',
        heading: 'Public Discourse Platforms',
        body: 'Providing video and podcast forums for emerging rural changemakers to share their visions.',
      },
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
    <span ref={ref} className="tabular-nums font-numeric font-bold">
      {prefix}{count.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

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
        <title>{content.title} — Ravivar Vichar</title>
        <meta name="description" content={content.heroDescription} />
      <link rel="preload" as="image" href="/whatwedo-hero.jpg" />
      </Helmet>

      <PageLayout>
        {/* ── Hero ── */}
        <section className="relative min-h-[70vh] lg:min-h-[calc(100vh-90px)] flex items-center overflow-hidden max-md:items-start max-md:pt-[12vh] lg:items-start lg:pt-[15vh]">
          {/* Rotating hero background (gallery of all hero images) */}
          <HeroSlideshow startIndex={7} />
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

        {/* ── How We Do It (paragraphs & bullet points) ── */}
        <section className="section-md bg-surface-white">
          <div className="container-content">
            <SectionHeading
              label="HOW WE DO IT"
              title={`Our Approach to ${content.title}`}
              description=""
            />

            {/* Intro paragraph */}
            {content.sections.intro && (
              <div className="max-w-3xl mx-auto mt-8">
                <p className="text-lg text-ink-secondary leading-relaxed text-center">
                  {content.sections.intro}
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="max-w-3xl mx-auto mt-12 mb-10 border-t border-gray-100" />

            {/* Bullet-point items */}
            <div className="max-w-4xl mx-auto space-y-5">
              {content.sections.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-5 p-6 lg:p-7 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-100 hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  {/* Check circle */}
                  <div className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-primary-50 text-primary-600 group-hover:bg-primary-100 group-hover:scale-110 group-hover:text-primary-700 transition-all duration-300">
                    <CheckCircle size={22} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0">
                    <h3 className="text-lg font-heading font-bold text-ink-primary mb-2 group-hover:text-primary-600 transition-colors duration-300">
                      {item.heading}
                    </h3>
                    <p className="text-body text-ink-secondary leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Our Goal ── */}
        {content.goal && (
          <section className="section-md bg-surface-white section-separator relative overflow-hidden">
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

        {/* ── Impact ── */}
        {content.impact && content.impact.length > 0 && (
        <section className="section-md bg-surface-section">
          <div className="container-content">
            <SectionHeading
              label="IMPACT"
              title="Our Impact Numbers"
              description=""
            />
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 ${content.impact.length === 2 ? 'lg:grid-cols-2 max-w-3xl mx-auto' : content.impact.length === 3 ? 'lg:grid-cols-3 max-w-5xl mx-auto' : 'lg:grid-cols-4'}`}>
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
        )}

        {/* ── CTA ── */}
        <section className="section-md bg-primary-500 relative overflow-hidden text-center">
          <FloatingDots count={4} />
          <div className="container-content relative z-10">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white">
              Have a Story on {content.title}?
            </h2>
            <p className="text-lg text-white/80 mt-4 max-w-xl mx-auto">
              Share your grassroots initiative, pitch an investigative feature, or collaborate with our newsroom.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Button variant="secondary" to="/get-featured" arrow>Pitch Your Story</Button>
              <Button variant="outline" to="/partner-with-us" className="border-white text-white hover:bg-white hover:text-primary-500">Partner With Us</Button>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
