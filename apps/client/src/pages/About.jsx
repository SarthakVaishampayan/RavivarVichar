import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import PageLayout from '../components/layout/PageLayout';
import SectionHeading from '../components/shared/SectionHeading';
import FloatingDots from '../components/shared/FloatingDots';
import Button from '../components/shared/Button';
import { Heart, Zap, Users, Globe, Newspaper, Monitor, Calendar, Search, Megaphone, Briefcase, Shield, Leaf, X } from 'lucide-react';
import RavivarModel from '../components/shared/RavivarModel';
import TeamMemberModal from '../components/shared/TeamMemberModal';

const stats = [
  { value: 15, suffix: '+', label: 'Years of Ravivar Digest' },
  { value: 2023, suffix: '', label: 'Ravivar Vichar Launched' },
  { value: 50, suffix: 'M+', label: 'Digital Reach' },
  { value: 100, suffix: '+', label: 'Ravivar Digest Published' },
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
  { icon: Monitor, title: 'Digital Platform', description: 'An innovative platform across social media channels dedicated to shedding light on critical issues concerning self-help groups and women\'s challenges, bridging the gap between information and action.' },
  { icon: Newspaper, title: 'Monthly Magazine', description: 'A monthly print and digital magazine featuring success stories, interviews, and in-depth articles on women\'s issues and empowerment.' },
  { icon: Calendar, title: 'Webinars & Workshops', description: 'Regular webinars, workshops, and training sessions designed to equip women with practical skills, knowledge, and confidence.' },
  { icon: Users, title: 'Community Building', description: 'Online communities and forums where women can connect, share experiences, seek support, and grow together.' },
  { icon: Search, title: 'Research & Analysis', description: 'In-depth research and analysis on SHG initiatives, women\'s economic empowerment, and gender issues to inform policies and practices.' },
  { icon: Megaphone, title: 'Advocacy', description: 'Advocacy efforts to promote gender equality, women\'s rights, and policies that empower women at every level.' },
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

  return <span ref={ref} className="tabular-nums font-numeric font-bold">{display}{suffix}</span>;
}

/* ── Preview overlay for compact tile cards (Goals & Core Values) ── */
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const tileModalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 28, stiffness: 300, mass: 0.8 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

function TilePreviewModal({ tile, onClose }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!tile) return;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [tile, handleKeyDown]);

  return (
    <AnimatePresence>
      {tile && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            variants={backdropVariants}
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            key="tile-preview-modal"
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            variants={tileModalVariants}
            role="dialog"
            aria-modal="true"
            aria-label={tile.title}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white hover:shadow-lg transition-all duration-200 group"
              aria-label="Close"
            >
              <X size={16} className="text-gray-500 group-hover:text-gray-800 transition-colors" />
            </button>

            {/* ─── Content ─── */}
            <div className="p-6 lg:p-8">
              {/* Section badge */}
              {tile.section && (
                <span className="inline-block mb-4 px-3.5 py-1.5 rounded-full text-xs font-semibold text-primary-600 bg-primary-50 border border-primary-100/60">
                  {tile.section}
                </span>
              )}

              {/* Icon + Title */}
              <div className="flex items-start gap-4">
                {tile.icon && (
                  <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
                    <tile.icon size={24} />
                  </div>
                )}
                <h2 className="text-2xl lg:text-3xl font-bold font-heading text-ink-primary">
                  {tile.title}
                </h2>
              </div>

              {/* Divider */}
              <div className="my-5 h-px bg-gradient-to-r from-gray-200 to-transparent" />

              {/* Description */}
              <p className="text-body text-ink-secondary leading-relaxed">{tile.description}</p>

              {/* Decorative bottom accent */}
              <div className="mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function About() {
  const [loaded, setLoaded] = useState(false);
  const [failedImages, setFailedImages] = useState({});
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);
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
        <section id="our-story" className="relative min-h-[70vh] lg:min-h-[calc(100vh-90px)] flex items-center overflow-hidden max-md:items-start max-md:pt-[12vh] lg:items-start lg:pt-[20vh]">
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
        <section id="our-goals" className="section-md bg-surface-white section-separator">
          <div className="container-content">
            <SectionHeading
              label="GOALS & OBJECTIVES"
              title="What We Aim to Achieve"
              description="Our roadmap to creating lasting impact for women everywhere."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
              {goals.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className={`card-hover p-6 lg:p-8 cursor-pointer select-none group${i === goals.length - 1 ? ' md:col-span-2 md:max-w-[calc((100%-1.5rem)/2)] md:mx-auto lg:col-span-1 lg:max-w-none' : ''}`}
                    onClick={() => setSelectedTile({ ...item, section: 'Goals & Objectives' })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedTile({ ...item, section: 'Goals & Objectives' });
                      }
                    }}
                    aria-label={`View details of ${item.title}`}
                  >
                    <div className="flex items-start gap-4 md:flex-col">
                      <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                        <Icon size={24} />
                      </div>
                      <div className="w-full min-w-0">
                        <h3 className="text-lg font-bold font-heading text-ink-primary flex flex-wrap items-center gap-2">
                          {item.title}
                          <span className="md:hidden inline-flex items-center text-[11px] font-semibold text-primary-600 bg-primary-50 border border-primary-100/60 px-2.5 py-0.5 rounded-full">
                            View
                          </span>
                        </h3>
                        <p className="hidden md:block text-sm text-ink-secondary mt-2 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section id="our-values" className="section-md bg-surface-section">
          <div className="container-content">
            <SectionHeading
              label="OUR CORE VALUES"
              title="What Drives Us"
              description="The principles that guide every partnership, program, and story we share."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-16">
              {coreValues.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className={`card-hover p-6 lg:p-8 text-center group cursor-pointer select-none${i === coreValues.length - 1 ? ' md:col-span-2 md:max-w-[calc((100%-1.5rem)/2)] md:mx-auto lg:col-span-1 lg:max-w-none' : ''}`}
                    onClick={() => setSelectedTile({ ...item, section: 'Core Values' })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedTile({ ...item, section: 'Core Values' });
                      }
                    }}
                    aria-label={`View details of ${item.title}`}
                  >
                    <div className="flex items-start gap-4 md:flex-col md:items-center">
                      <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 mb-0 md:mb-4 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                        <Icon size={22} />
                      </div>
                      <h3 className="text-base font-bold font-heading text-ink-primary mb-2 group-hover:text-primary-500 transition-colors duration-300 flex items-center gap-2 flex-wrap md:justify-center">
                        {item.title}
                        <span className="md:hidden inline-flex items-center text-[11px] font-semibold text-primary-600 bg-primary-50 border border-primary-100/60 px-2.5 py-0.5 rounded-full">
                          View
                        </span>
                      </h3>
                    </div>
                    <p className="hidden md:block text-sm text-ink-secondary leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Journey */}
        <section id="our-journey" className="section-md bg-surface-white">
          <div className="container-content">
            <SectionHeading
              label="OUR JOURNEY"
              title="A Decade of Impact"
              description="From a small initiative to a recognized force in rural development — our journey of growth and impact."
            />
            <div className="relative mt-16">
              <div className="absolute left-4 min-[550px]:left-1/2 top-0 bottom-0 w-px bg-gray-200 min-[550px]:-translate-x-px" />
              <div className="space-y-2">
                {(() => {
                  const milestoneMap = {
                    '2010': { title: 'Foundation', description: 'Ravivar Vichar was established with a vision to revive rural livelihoods through research and community action.' },
                    '2013': { title: 'First SHG Network', description: 'Associated with first Self-Help Group network in 20 villages across Bhilwara district.' },
                    '2016': { title: 'Entrepreneurship Program', description: 'Started the women entrepreneurship program, training 500+ rural women in business skills.' },
                    '2019': { title: 'Research Wing', description: 'Established our research division to produce data-driven policy recommendations for rural development.' },
                    '2023': { title: 'Digital Expansion', description: 'Launched digital literacy programs and expanded our reach to 500+ villages across Central India.' },
                    '2025': { title: 'National Impact', description: 'Recognized nationally for our community-driven development model and sustainable impact.' },
                    '2026': { title: 'Strategic Brand Collaborations', description: 'Established partnerships with leading ethical and sustainable brands including Suta Bombay, expanding market access for women-led enterprises.' },
                  };
                  const years = [];
                  for (let y = 2010; y <= 2026; y++) {
                    const key = String(y);
                    const m = milestoneMap[key];
                    years.push({
                      year: key,
                      title: m?.title || null,
                      description: m?.description || null,
                      isMilestone: !!m,
                    });
                  }
                  return years;
                })().map((item, i, arr) => {
                  /* Compute milestone-only index for alternating layout */
                  let milestoneIndex = 0;
                  for (let j = 0; j < i; j++) {
                    if (arr[j].isMilestone) milestoneIndex++;
                  }
                  const isLeft = milestoneIndex % 2 === 0;

                  if (item.isMilestone) {
                    /* ── Milestone year: slide-in from side on scroll ── */
                    return (
                      <motion.div
                        key={item.year}
                        initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ margin: '-220px 0px -40px 0px' }}
                        transition={{ duration: 0.5, delay: milestoneIndex * 0.1, ease: 'easeOut' }}
                        className={`relative flex flex-col min-[550px]:flex-row items-start gap-4 min-[550px]:gap-6 ${isLeft ? 'min-[550px]:flex-row' : 'min-[550px]:flex-row-reverse'}`}>
                        <div className={`flex-1 ${isLeft ? 'min-[550px]:text-right' : 'min-[550px]:text-left'}`}>
                          <div className="card p-3 min-[550px]:p-4 inline-block max-w-lg">
                            <span className="text-xs font-bold text-primary-500">{item.year}</span>
                            <h3 className="text-sm min-[550px]:text-base font-bold font-heading text-ink-primary mt-0.5">{item.title}</h3>
                            <p className="text-xs min-[550px]:text-sm text-ink-secondary mt-1.5 leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                        <div className="absolute left-4 min-[550px]:left-1/2 w-4 h-4 rounded-full bg-primary-500 border-4 border-white shadow -translate-x-1.5 min-[550px]:-translate-x-2 mt-2 z-10" />
                        <div className="flex-1 hidden min-[550px]:block" />
                      </motion.div>
                    );
                  } else {
                    /* ── Non-milestone year: fade-in dot on scroll ── */
                    return (
                      <motion.div
                        key={item.year}
                        initial={{ opacity: 0, scale: 0.6 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ margin: '-150px 0px -30px 0px' }}
                        transition={{ duration: 0.35, delay: i * 0.03 }}
                        className="relative flex items-center py-1.5">
                        <div className="absolute left-4 min-[550px]:left-1/2 w-2.5 h-2.5 rounded-full bg-gray-300 border-2 border-white shadow-sm -translate-x-[5px] min-[550px]:-translate-x-[5px] z-10" />
                        <div className="flex-1 pl-10 min-[550px]:pl-[calc(50%+1.5rem)]">
                          <span className="text-sm text-gray-400 font-medium">{item.year}</span>
                        </div>
                      </motion.div>
                    );
                  }
                })}
              </div>

              {/* Timeline fade overlay */}
              <div className="absolute left-4 min-[550px]:left-1/2 bottom-0 w-px h-32 bg-gradient-to-b from-gray-200 to-transparent -translate-x-px min-[550px]:-translate-x-px pointer-events-none z-0" />

              {/* ── The journey continues ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: '-220px 0px -40px 0px' }}
                transition={{ duration: 0.5 }}
                className="relative pt-10 pb-4"
              >
                {/* Pulsing beacon dot on the timeline */}
                <div className="absolute left-4 min-[550px]:left-1/2 w-5 h-5 rounded-full bg-primary-400 border-[3px] border-primary-100 shadow-lg shadow-primary-300/40 -translate-x-[10px] min-[550px]:-translate-x-[10px] z-10">
                  <div className="absolute inset-0 rounded-full bg-primary-400 animate-ping opacity-30" />
                </div>
                {/* Message */}
                <div className="pl-14 min-[550px]:pl-[calc(50%+2rem)] pr-4">
                  <div className="max-w-md">
                    <span className="text-xs font-bold tracking-widest text-primary-500 uppercase">Ongoing</span>
                    <p className="text-sm text-ink-secondary mt-2 leading-relaxed italic">
                      Our work does not pause at a milestone. With every passing day, we continue to 
                      empower more women, strengthen more communities, and move closer to our vision 
                      of a truly equitable society.
                    </p>
                    <div className="flex items-center gap-1.5 mt-3 text-primary-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Key Initiatives */}
        <section className="section-md bg-surface-section">
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
                  <div
                    key={item.title}
                    className="card p-6 lg:p-8 h-full cursor-pointer select-none group"
                    onClick={() => setSelectedTile({ ...item, section: 'Key Initiatives' })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedTile({ ...item, section: 'Key Initiatives' });
                      }
                    }}
                    aria-label={`View details of ${item.title}`}
                  >
                    <div className="flex items-start gap-5 h-full">
                      <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                        <Icon size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold font-heading text-ink-primary mb-1.5 flex flex-wrap items-center gap-2">
                          {item.title}
                          <span className="md:hidden inline-flex items-center text-[11px] font-semibold text-primary-600 bg-primary-50 border border-primary-100/60 px-2.5 py-0.5 rounded-full">
                            View
                          </span>
                        </h3>
                        <p className="hidden md:block text-sm text-ink-secondary leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our History */}
        <section id="our-history" className="section-md bg-surface-white">
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

            <div className="grid grid-cols-1 min-[550px]:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-16">
              {[
                {
                  name: 'Mr. Rohan Sharma',
                  role: 'Chief Executive Officer',
                  bio: 'Technology leader, storyteller, and social impact entrepreneur. As CEO of Ravivar Vichar, he leads a platform dedicated to empowering SHGs and advancing women\'s financial independence through innovation and media.',
                  fullBio: 'Rohan Sharma is a technology leader, storyteller, and social impact entrepreneur committed to creating meaningful change through innovation and media.' + '\n\n' + 'As the CEO of Ravivar Vichar, he leads a digital media and print platform dedicated to empowering Self-Help Groups (SHGs) and advancing women\'s financial independence. Under his leadership, Ravivar Vichar connects grassroots communities with institutions, promoting financial literacy, inclusion, and sustainable livelihoods.' + '\n\n' + 'Rohan began his career at TCS before working with Accenture and Oracle Corporation, building expertise in technology, strategy, and digital transformation. Alongside his corporate journey, he has written for podcasts, films, and web series, creating stories inspired by India\'s cultural and social ethos.',
                  image: '/images/team/rohan.jpeg',
                },
                {
                  name: 'Mr. Satyam Khandelwal',
                  role: 'Managing Director',
                  bio: 'Driving Ravivar Vichar\'s mission of empowering SHGs and advancing women\'s economic development through financial inclusion, community engagement, and sustainable livelihood initiatives.',
                  fullBio: 'Satyam Khandelwal is the Managing Director of Ravivar Vichar, where he drives the platform\'s mission of empowering Self-Help Groups (SHGs) and advancing women\'s economic and social development through financial inclusion, community engagement, and sustainable livelihood initiatives.' + '\n\n' + 'With academic qualifications in Mass Communication, Commerce, and Law, Satyam brings a multidisciplinary perspective to leadership.' + '\n\n' + 'An entrepreneur with extensive experience in land development and construction, he combines business acumen, legal expertise, and strategic vision to build impactful partnerships and strengthen Ravivar Vichar\'s commitment to inclusive growth.',
                  image: '/images/team/satyam.jpeg',
                },
                {
                  name: 'Dr. Subhash Khandelwal',
                  role: 'Editor-in-Chief',
                  bio: 'Editor-in-Chief of Ravivar for over 30 years, establishing it as a respected platform for incisive analysis and informed commentary on national and international affairs.',
                  fullBio: 'Dr. Subhash Khandelwal is the Editor-in-Chief of Ravivar, a position he has held for over 30 years. Under his editorial leadership, Ravivar has established itself as a respected platform for incisive analysis and informed commentary on national and international affairs, covering politics, economics, society, governance, culture, and global developments.' + '\n\n' + 'Inspired by the ideals of socialism, Dr. Khandelwal began his public life through active student politics and later served on the University Executive Council. He holds an LL.B. and a Doctorate in the Economics of the Ramayana Era, reflecting his interest in the intersection of India\'s intellectual traditions and contemporary public discourse.' + '\n\n' + 'Known for his balanced perspectives and commitment to independent journalism, Dr. Khandelwal has consistently championed democratic values, social justice, and the preservation of India\'s social fabric. Through Ravivar, he continues to contribute meaningfully to public debate, offering thoughtful analysis that informs, challenges, and inspires readers across generations.',
                  image: '/images/team/subhash.jpeg',
                },
                {
                  name: 'Mr. Arvind Mandloi',
                  role: 'Author & Social Commentator',
                  bio: 'Distinguished author and social commentator, recognized for his insightful contributions to literature and journalism with bestselling works and respected commentaries in leading Hindi publications.',
                  fullBio: 'Arvind Mandloi is a distinguished author and social commentator, widely recognized for his insightful contributions to the literary and journalistic world.' + '\n\n' + 'Born with a passion for words and a keen sense of social consciousness, his literary journey has been marked by a series of thought-provoking works like JADUNAMA: JAVED AKHTAR-EK SAFAR (Bestselling book of the year 2022, 2023 & 2024), SAHIR KI SHAYARANA JADUGIRI, SRIJAN KE SAAT DASHAK, AWAAZ DO HUM EK HAI & KHWAAB KE GAON MEIN (Amazon Bestseller book) that have left a mark on the hearts and minds of his readers.' + '\n\n' + 'Over the years, he has contributed insightful perspectives and commentaries to various Hindi publications like DAINIK BHASKAR, Outlook etc., making him a respected voice in the world of journalism.' + '\n\n' + 'He is actively involved with "Roopankan," a multipurpose space dedicated to nurturing the talents of underprivileged youth in Indore.',
                  image: '/images/team/arvind.jpeg',
                },
                {
                  name: 'Mr. Abhishek Sharma',
                  role: 'Media & Entertainment Leader',
                  bio: 'Seasoned media and entertainment leader with an esteemed journalistic career spanning years of impactful storytelling and editorial excellence, driving strategic growth and innovative entertainment initiatives.',
                  fullBio: 'Abhishek Sharma is a seasoned media and entertainment leader with an esteemed journalistic career spanning years of impactful storytelling and editorial excellence.' + '\n\n' + 'Renowned for his strategic vision and deep understanding of the media landscape, he has successfully bridged journalism with the evolving world of entertainment.' + '\n\n' + 'As the driving force behind multiple entertainment verticals, Mr. Sharma leads the strategic growth and expansion of innovative entertainment initiatives. He is instrumental in building high-value partnerships, developing original entertainment properties, and strengthening the brand\'s presence across events, media, and experiential platforms.' + '\n\n' + 'With a sharp focus on creativity, audience engagement, and scalable business models, Mr. Sharma continues to shape compelling experiences that resonate with contemporary audiences. Under his leadership, Ravivar Vichar has evolved into a dynamic platform for women empowerment, storytelling, and cultural experiences, setting new benchmarks.',
                  image: '/images/team/abhishek.jpeg',
                },
                {
                  name: 'Dr. Vivek Vardhan Shrivastava',
                  role: 'Senior Journalist & Media Academic',
                  bio: 'A senior journalist, media academic, and advocate of positive and developmental journalism with over 25 years of experience across India\'s leading news channels and publications, committed to meaningful public discourse and sustainable progress.',
                  fullBio: 'Dr. Vivek Vardhan Shrivastava is a senior journalist, media academic, and advocate of positive and developmental journalism with over 25 years of experience across some of India\'s leading news channels and publications.' + '\n\n' + 'His work has consistently focused on issues of social development, literature, environment, public health, arts, culture, and traditional ways of living, promoting meaningful public discourse and sustainable progress.' + '\n\n' + 'Dr. Shrivastava holds a Ph.D. for his research on the role of media in the conservation of the Narmada River, reflecting his deep commitment to environmental communication and responsible journalism. Throughout his career, he has combined editorial excellence with a strong focus on public interest reporting, highlighting stories that inspire awareness, community participation, and positive change.' + '\n\n' + 'A recipient of numerous awards and recognitions across journalism, literature, environmental awareness, and social communication, Dr. Shrivastava continues to contribute to the media landscape through insightful writing, research, and thought leadership.',
                  image: '/images/team/vivek.jpeg',
                },
                {
                  name: 'Ms. Risika Alok',
                  role: 'Coordinating Editor',
                  bio: 'Leads editorial planning, content strategy, and digital communications at Ravivar Vichar. A graduate in Biotechnology turned journalist with a passion for research, storytelling, and public engagement.',
                  fullBio: 'Risika Alok is the Coordinating Editor at Ravivar Vichar, where she leads editorial planning, content strategy, and digital communications.' + '\n\n' + 'A graduate in Biotechnology, she transitioned into journalism and digital media with a passion for research, storytelling, and public engagement. She works closely with the editorial and creative teams to identify impactful stories, oversee multimedia content production, and ensure that Ravivar Vichar\'s initiatives are communicated effectively across digital platforms.' + '\n\n' + 'Over the years, she has conducted interviews with entrepreneurs, policymakers, social workers, artists, athletes, and changemakers, bringing forward stories that inspire dialogue and social impact. She has contributed to documenting grassroots initiatives, women-led enterprises, governance, culture, livelihoods, and community development while building partnerships and strengthening the organisation\'s public outreach. Her work combines research-driven journalism with digital storytelling to make complex issues accessible to a wider audience.' + '\n\n' + 'Beyond her role at Ravivar Vichar, she has built and grown her own social media platform, where she creates insightful content on governance, public policy, social issues, and current affairs. Through both Ravivar Vichar and her independent digital presence, she is committed to fostering informed conversations, amplifying underrepresented voices, and using media as a powerful tool for awareness, education, and positive social change.',
                  image: '/images/team/risika.jpeg',
                },
                {
                  name: 'Ms. Vaishnavi Shukla',
                  role: 'Creative Video Editor & Graphic Designer',
                  bio: 'Creative professional with over 5 years of experience in video editing, graphic design, animation, and digital storytelling, creating compelling visual content that highlights stories of struggle, resilience, success, and social impact.',
                  fullBio: 'Vaishnavi Shukla is a creative professional with over 5 years of experience in video editing, graphic design, animation, and digital storytelling. Throughout her career, she has worked on creating compelling visual content that highlights stories of struggle, resilience, success, and social impact.' + '\n\n' + 'She believes that every story has the power to inspire and create meaningful connections. With a strong eye for detail and a passion for creative storytelling, she transforms ordinary moments into engaging visual experiences that leave a lasting impression on audiences.' + '\n\n' + 'Her work has also earned recognition through achievements such as being the runner-up at IMA Animation Maestro and receiving a nomination for Best Animation Short Film at the MAAC National Film Fest. She continues to combine creativity, technical expertise, and thoughtful storytelling to deliver impactful visual content.',
                  image: '/images/team/vaishnavi.jpg',
                },
              ].map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 delay-200 hover:-translate-y-1.5 hover:scale-[1.02]"
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
                        className="w-full h-full object-cover transition-all duration-700 delay-200 ease-out group-hover:scale-110 group-hover:rotate-[1deg]"
                        loading="lazy"
                        onError={() => handleImageError(member.name)}
                      />
                    )}

                    {/* Gradient overlay — visible on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200" />
                  </div>

                  {/* ── Content ── */}
                  <div className="relative p-5 lg:p-6 flex flex-col">
                    {/* Name */}
                    <h3 className="text-lg font-bold font-heading text-ink-primary">
                      {member.name}
                    </h3>

                    {/* Glass role badge */}
                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-[11px] font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/50 shadow-sm">
                      {member.role}
                    </span>

                    {/* Bio — 2-3 intro lines, hidden by default, reveals on hover */}
                    <div className="overflow-hidden transition-all duration-500 delay-200 ease-out max-h-0 group-hover:max-h-24 opacity-0 group-hover:opacity-100 mt-0 group-hover:mt-3">
                      <p className="text-sm text-ink-secondary leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    </div>

                    {/* Read More button — hidden by default, reveals on hover below bio */}
                    <div className="overflow-hidden transition-all duration-500 delay-200 ease-out max-h-0 group-hover:max-h-12 opacity-0 group-hover:opacity-100 mt-0 group-hover:mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMember(member);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                      >
                        Read More
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Bottom hover accent bar */}
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-200 origin-left" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team Member Detail Modal */}
          <TeamMemberModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />

          {/* Tile Preview Modal (Goals & Core Values) */}
          <TilePreviewModal
            tile={selectedTile}
            onClose={() => setSelectedTile(null)}
          />
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
