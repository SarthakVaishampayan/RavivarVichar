import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import PageLayout from '../components/layout/PageLayout';
import SectionHeading from '../components/shared/SectionHeading';
import FloatingDots from '../components/shared/FloatingDots';
import Button from '../components/shared/Button';
import { Eye, Heart, BookOpen, Zap, Users, Globe, Newspaper, Monitor, Calendar, Search, Megaphone, Briefcase, Shield, Leaf, Quote, Linkedin, Mail } from 'lucide-react';
import RavivarModel from '../components/shared/RavivarModel';

const stats = [
  { value: 32, suffix: '+', label: 'Years of Publication' },
  { value: 2023, suffix: '', label: 'Ravivar Vichar Launched' },
  { value: 10, suffix: 'K+', label: 'Digital Reach' },
  { value: 100, suffix: '+', label: 'Issues Published' },
];

const coreValues = [
  {
    icon: Zap,
    title: 'Empowerment',
    description: 'We believe every woman should have the knowledge, skills, opportunities, and agency to shape her own future.',
  },
  {
    icon: Users,
    title: 'Collective Action',
    description: 'We believe lasting change is created when communities, institutions, businesses, and individuals work together.',
  },
  {
    icon: Heart,
    title: 'Inclusion',
    description: 'We work to ensure that opportunities reach women and communities across different social, economic, geographic, and cultural backgrounds.',
  },
  {
    icon: Shield,
    title: 'Integrity',
    description: 'We are committed to transparency, responsible partnerships, and being accountable for the impact we seek to create.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Impact',
    description: 'We focus on solutions that build long-term independence, resilient livelihoods, and stronger communities, not temporary interventions.',
  },
];

const goals = [
  { icon: Briefcase, title: 'Enable Economic Independence', description: 'Create pathways for women and communities to build sustainable livelihoods through entrepreneurship, skill development, financial literacy, market access, and opportunities.' },
  { icon: Users, title: 'Strengthen Community-Led Growth', description: 'Support Self Help Groups, women entrepreneurs, and rural communities through knowledge, capacity building, partnerships, and access to networks and resources.' },
  { icon: Globe, title: 'Build Inclusive Ecosystems for Lasting Impact', description: 'Bring together institutions, businesses, policymakers, civil society, and communities to foster collaboration, leadership, innovation, and sustainable social change.' },
];

const initiatives = [
  { icon: Monitor, title: 'Digital Platform', description: "Ravivar Vichar is an innovative platform spread across various social media channels that is dedicated to shedding light on the critical issues concerning self-help groups and women's challenges in contemporary society. It leverages the power of social media to bridge the gap between information and action." },
  { icon: Newspaper, title: 'Monthly Magazine', description: "Launch a monthly print and digital magazine featuring success stories, interviews, and in-depth articles on women's issues." },
  { icon: Calendar, title: 'Webinars and Workshops', description: 'Organise webinars, workshops, and training sessions to provide women with practical skills and knowledge.' },
  { icon: Users, title: 'Community Building', description: 'Create online communities and forums where women can connect, share experiences, and seek support.' },
  { icon: Search, title: 'Research and Analysis', description: "Conduct research and analysis on self-help group initiatives, women's economic empowerment, and gender-related issues, publishing our findings to inform policies and practices." },
  { icon: Megaphone, title: 'Advocacy', description: "Engage in advocacy efforts to promote gender equality and women's rights and support policies that empower women." },
];

const visionTexts = [
  'Ravivar Vichar envisions a world where women from self-help groups and beyond can reach their full potential, break barriers, and lead fulfilling lives. By sharing stories of success, addressing issues, and providing valuable resources, we aim to be a catalyst for positive change and contribute to a more equitable and empowered society. Together, we can build a brighter future for women everywhere.',
  'Our vision is to be a leading global platform that serves as a beacon of inspiration, support, and knowledge for women involved in self-help groups and all women in general. We aspire to foster positive change, empowerment, and gender equality through our content and engagement.',
];

function AnimatedCounter({ value, suffix = '', duration = 2000 }) {
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

  const display = value === 2023
    ? count
    : count.toLocaleString('en-IN');

  return <span ref={ref} className="tabular-nums">{display}{suffix}</span>;
}

export default function About() {
  const [loaded, setLoaded] = useState(false);
  const [failedImages, setFailedImages] = useState({});
  const location = useLocation();

  const handleImageError = (name) => {
    setFailedImages(prev => ({ ...prev, [name]: true }));
  };

  useEffect(() => {
    const img = new Image();
    img.src = '/about-hero.jpg';
    img.onload = () => setLoaded(true);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <>
      <Helmet>
        <title>About Us — Ravivar Vichar</title>
        <meta name="description" content="Ravivar Vichar is a digital and print platform under Ravivar Publications Pvt. Ltd., dedicated to empowering women from self-help groups through stories, resources, and advocacy." />
      <link rel="preload" as="image" href="/about-hero.jpg" />
      </Helmet>

      <PageLayout>
        {/* Hero */}
        <section id="our-story" className="relative min-h-[70vh] lg:min-h-[calc(100vh-90px)] flex items-start overflow-hidden max-lg:pt-[12vh] pt-[20vh]">
          {/* Background image */}
          <div className="absolute inset-0 bg-gray-900">
            <img
  src="/about-hero.jpg"
  alt="About Ravivar Vichar"
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
              <span className="text-sm font-semibold tracking-[0.15em] text-white/70 uppercase inline-block mb-5">ABOUT US</span>
              <h1 className="text-3xl max-lg:text-hero-mobile lg:text-5xl text-white leading-[1.2]">
                Amplifying Women's{' '}
                <span className="text-primary-500">Voices</span>
              </h1>
              <p className="text-lg text-white/70 mt-6 leading-relaxed max-w-[550px]">
                Ravivar Vichar is a social impact organization empowering women through entrepreneurship, knowledge, leadership, and community-driven action. We connect women, Self Help Groups, entrepreneurs, and institutions to create opportunities that foster economic independence and lasting social impact.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="section-md bg-surface-white">
          <div className="container-content">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center group">
                  <div className="text-4xl lg:text-5xl font-bold font-heading text-primary-500 group-hover:text-primary-600 transition-colors duration-300">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-ink-secondary mt-2 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision */}
        <section id="our-vision" className="section-md bg-surface-section">
          <div className="container-content">
            <div className="max-w-3xl mx-auto">
              <SectionHeading
                label="OUR VISION"
                title="A World of Empowered Women"
                description=""
                align="center"
              />
              <div className="space-y-6 text-body text-ink-secondary mt-10">
                {visionTexts.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section id="our-mission" className="section-md bg-surface-white">
          <div className="container-content">
            <div className="max-w-3xl mx-auto">
              <SectionHeading
                label="OUR MISSION"
                title="Empower, Uplift, Inspire"
                description=""
                align="center"
              />
              <p className="text-body text-ink-secondary mt-10 text-center max-w-2xl mx-auto">
                Ravivar Vichar is dedicated to empowering and uplifting women from self-help groups in India and 
                around the world by providing a comprehensive digital and print platform. Our mission is to share 
                success stories and perspectives, address issues, and offer insightful analyses that celebrate the 
                achievements of these women and shed light on a wide range of female-related topics.
              </p>
            </div>
          </div>
        </section>

        {/* Our Model */}
        <RavivarModel />

        {/* Goals & Objectives */}
        <section id="our-goals" className="section-md bg-surface-section">
          <div className="container-content">
            <SectionHeading
              label="GOALS & OBJECTIVES"
              title="What We Aim to Achieve"
              description="Our roadmap to creating lasting impact for women everywhere."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
              {goals.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="card-hover p-6 lg:p-8">
                    <div className="flex flex-col items-start gap-4">
                      <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-heading text-ink-primary">{item.title}</h3>
                        <p className="text-sm text-ink-secondary mt-2 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section id="our-values" className="section-md bg-surface-white">
          <div className="container-content">
            <SectionHeading
              label="OUR CORE VALUES"
              title="What Drives Us"
              description="The principles that guide every partnership, program, and story we share."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-16">
              {coreValues.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="card-hover p-6 lg:p-8 text-center group">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 mb-4 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-base font-bold font-heading text-ink-primary mb-2 group-hover:text-primary-500 transition-colors duration-300">{item.title}</h3>
                    <p className="text-sm text-ink-secondary leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
            {/* Quote */}
            <div className="mt-16 text-center max-w-2xl mx-auto">
              <div className="relative">
                <Quote size={40} className="text-primary-200 absolute -top-4 -left-4 opacity-50" />
                <p className="text-xl lg:text-2xl font-heading font-bold text-ink-primary italic leading-relaxed">
                  "We believe meaningful change is built with people, not simply delivered to them"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Journey */}
        <section id="our-journey" className="section-md bg-surface-section">
          <div className="container-content">
            <SectionHeading
              label="OUR JOURNEY"
              title="A Decade of Impact"
              description="From a small initiative to a recognized force in rural development — our journey of growth and impact."
            />
            <div className="relative mt-16">
              <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-gray-200 lg:-translate-x-px" />
              <div className="space-y-12">
                {[
                  { year: '2010', title: 'Foundation', description: 'Ravivar Vichar was established with a vision to revive rural livelihoods through research and community action.' },
                  { year: '2013', title: 'First SHG Network', description: 'Launched our first Self-Help Group network in 20 villages across Bhilwara district.' },
                  { year: '2016', title: 'Entrepreneurship Program', description: 'Started the women entrepreneurship program, training 500+ rural women in business skills.' },
                  { year: '2019', title: 'Research Wing', description: 'Established our research division to produce data-driven policy recommendations for rural development.' },
                  { year: '2022', title: 'Digital Expansion', description: 'Launched digital literacy programs and expanded our reach to 500+ villages across Rajasthan.' },
                  { year: '2025', title: 'National Impact', description: 'Recognized nationally for our community-driven development model and sustainable impact.' },
                ].map((item, i) => (
                  <div key={item.year} className={`relative flex flex-col lg:flex-row items-start gap-8 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                      <div className="card p-6 lg:p-8 inline-block max-w-lg">
                        <span className="text-sm font-bold text-primary-500">{item.year}</span>
                        <h3 className="text-xl font-bold font-heading text-ink-primary mt-1">{item.title}</h3>
                        <p className="text-body text-ink-secondary mt-3">{item.description}</p>
                      </div>
                    </div>
                    <div className="absolute left-4 lg:left-1/2 w-4 h-4 rounded-full bg-primary-500 border-4 border-white shadow -translate-x-1.5 lg:-translate-x-2 mt-2 z-10" />
                    <div className="flex-1 hidden lg:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Key Initiatives */}
        <section className="section-md bg-surface-white">
          <div className="container-content">
            <SectionHeading
              label="KEY INITIATIVES"
              title="Our Flagship Programs"
              description="Concrete actions we're taking to turn our vision into reality."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
              {initiatives.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="card p-6 lg:p-8">
                    <div className="flex items-start gap-5">
                      <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-card font-heading font-bold text-ink-primary mb-2">{item.title}</h3>
                        <p className="text-body text-ink-secondary">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our History */}
        <section id="our-history" className="section-md bg-surface-section">
          <div className="container-content">
            <SectionHeading
              label="OUR HISTORY"
              title="Three Decades of Impact"
              description="From a trusted magazine to a modern digital platform — our journey of growth."
            />
            <div className="max-w-3xl mx-auto mt-12 space-y-8 text-body text-ink-secondary">
              <p>
                Ravivar Vichar, a prominent digital and print platform, is a publication under the esteemed banner 
                of Ravivar Publications Pvt. Ltd. It has been a part of the media landscape for over three decades, 
                gaining recognition for its flagship publication, <strong>Ravivar Digest</strong>, which has been in 
                circulation for 32 years.
              </p>
              <p>
                Ravivar Digest has been a trailblazer in addressing social and contemporary issues. It has consistently 
                played a vital role in enlightening society about various pertinent matters, with a particular emphasis 
                on promoting awareness about self-help groups and women's issues. Over the years, it has established 
                itself as a trusted source of information and inspiration.
              </p>
              <p>
                In <strong>2023</strong>, the publication expanded its horizons by launching Ravivar Vichar, a platform 
                that aimed to provide a digital space for contemporary discourse. This venture was driven by the 
                commitment to amplify the voices of marginalised communities, especially women, and shed light on the 
                challenges they face. The response to Ravivar Vichar has been nothing short of phenomenal, resonating 
                with a diverse cross-section of society.
              </p>
              <p>
                Ravivar Vichar continues to uphold the legacy of Ravivar Publications Pvt. Ltd., serving as a beacon 
                of informed journalism and social awareness as it carries forward its mission to educate, inspire, and 
                empower its readership.
              </p>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section
          id="our-team"
          className="section-md relative overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #FFF9F4 0%, #FFFFFF 40%, #FFF7F1 100%)' }}
        >
          {/* Subtle background blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 left-1/3 w-64 h-64 rounded-full bg-primary-100/30 blur-3xl" />
            <div className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full bg-secondary-100/20 blur-3xl" />
          </div>

          <div className="container-content relative z-10">
            <SectionHeading
              label="OUR TEAM"
              title="Meet the People Behind the Mission"
              description="Passionate individuals committed to driving change in rural communities."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-16">
              {[
                { name: 'Rohan Sharma', role: 'Chief Executive Officer', bio: 'Leading the vision and strategy of Ravivar Vichar with a passion for driving social impact and empowering women across India.', image: '/images/team/1.jpg' },
                { name: 'Sampath', role: 'Chief Financial Officer', bio: 'Overseeing financial strategy and operations to ensure sustainable growth and effective resource management.', image: '/images/team/2.jpg' },
                { name: 'Rishika Joshi', role: 'Chief Operational Manager', bio: 'Managing day-to-day operations and ensuring seamless execution of programs and initiatives.', image: '/images/team/3.jpg' },
                { name: 'Sarthak Vaishampayan', role: 'Software Developer', bio: 'Building and maintaining the digital platform to amplify our reach and impact in the digital space.', image: '/images/team/4.jpg' },
              ].map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:scale-[1.02]"
                >
                  {/* ── Image (60% of card) ── */}
                  <div className="relative h-56 lg:h-64 overflow-hidden">
                    {failedImages[member.name] ? (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                        <Users size={44} className="text-primary-400" />
                      </div>
                    ) : (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-[1deg]"
                        loading="lazy"
                        onError={() => handleImageError(member.name)}
                      />
                    )}

                    {/* Gradient overlay — visible on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Social icons — slide up on hover */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                      <span className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-primary-50 transition-colors cursor-pointer">
                        <Linkedin size={14} className="text-primary-600" />
                      </span>
                      <span className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-primary-50 transition-colors cursor-pointer">
                        <Mail size={14} className="text-primary-600" />
                      </span>
                    </div>
                  </div>

                  {/* ── Content ── */}
                  <div className="relative p-5 lg:p-6">
                    {/* Name */}
                    <h3 className="text-lg font-bold font-heading text-ink-primary">
                      {member.name}
                    </h3>

                    {/* Glass role badge */}
                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-[11px] font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/50 shadow-sm">
                      {member.role}
                    </span>

                    {/* Bio — hidden by default, reveals on hover */}
                    <div className="overflow-hidden transition-all duration-500 ease-out max-h-0 group-hover:max-h-28 opacity-0 group-hover:opacity-100 mt-0 group-hover:mt-3">
                      <p className="text-sm text-ink-secondary leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </div>

                  {/* Bottom hover accent bar */}
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-md bg-primary-500 relative overflow-hidden">
          <FloatingDots />
          <div className="container-content relative z-10 text-center">
            <h2 className="text-section-mobile lg:text-section text-white font-heading font-bold">
              Join Our Movement
            </h2>
            <p className="text-lg text-white/80 mt-4 max-w-xl mx-auto">
              Whether you want to share your story, partner with us, or support our mission — every voice matters.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Button variant="secondary" to="/join-our-initiative" arrow>Join Our Initiative</Button>
              <Button variant="outline" to="/contact" className="border-white text-white hover:bg-white hover:text-primary-500">Get in Touch</Button>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
