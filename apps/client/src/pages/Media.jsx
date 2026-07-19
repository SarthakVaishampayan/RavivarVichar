import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import SectionHeading from '../components/shared/SectionHeading';
import Button from '../components/shared/Button';
import { Play, Image, FileText, Calendar, ArrowRight } from 'lucide-react';

const tabs = ['Gallery', 'Videos', 'Press Releases'];

const galleryItems = [
  { caption: 'Women Entrepreneurship Workshop in Bhilwara', category: 'Workshops' },
  { caption: 'SHG Meeting in Chittorgarh District', category: 'Community' },
  { caption: 'Health Camp at Udaipur Village', category: 'Health' },
  { caption: 'Financial Literacy Training Session', category: 'Education' },
  { caption: 'Annual Conference 2025 Group Photo', category: 'Events' },
  { caption: 'Research Team Conducting Field Survey', category: 'Research' },
  { caption: 'Organic Farming Training Program', category: 'Livelihood' },
  { caption: 'Children\'s Education Initiative', category: 'Education' },
  { caption: 'Community Festival Celebration', category: 'Community' },
];

const videos = [
  { title: 'Ravivar Vichar: Our Story', duration: '4:32', date: 'Jan 2025' },
  { title: 'Women Entrepreneurs: Stories of Change', duration: '8:15', date: 'Nov 2024' },
  { title: 'SHG Success Story: From Savings to Enterprise', duration: '6:45', date: 'Sep 2024' },
  { title: 'Annual Conference 2025 Highlights', duration: '3:50', date: 'Mar 2025' },
];

const pressReleases = [
  { title: 'Ravivar Vichar Launches New Financial Literacy Program in 50 Villages', date: 'Feb 20, 2025', source: 'Press Trust of India' },
  { title: 'NGO\'s Women Entrepreneurship Model Recognized by NITI Aayog', date: 'Jan 15, 2025', source: 'The Hindu' },
  { title: 'Rural SHG Network Crosses 200 Groups Milestone', date: 'Dec 5, 2024', source: 'Times of India' },
  { title: 'Research Report on Rural Financial Inclusion Launched', date: 'Oct 22, 2024', source: 'Indian Express' },
];

export default function Media() {
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('Gallery');

  useEffect(() => {
    const img = new Image();
    img.src = '/media-hero.jpg';
    img.onload = () => setLoaded(true);
  }, []);

  return (
    <>
      <Helmet>
        <title>Media — Ravivar Vichar</title>
        <meta name="description" content="Browse photos, videos, and press releases from Ravivar Vichar's rural development programs and events." />
      <link rel="preload" as="image" href="/media-hero.jpg" />
      </Helmet>

      <PageLayout>
        {/* Hero */}
        <section className="relative min-h-[70vh] lg:min-h-[calc(100vh-90px)] flex items-start overflow-hidden max-lg:pt-[12vh] pt-[15vh]">
          {/* Background image */}
          <div className="absolute inset-0 bg-gray-900">
            <img
  src="/media-hero.jpg"
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
              <span className="text-sm font-semibold tracking-[0.15em] text-white/70 uppercase inline-block mb-5">MEDIA</span>
              <h1 className="text-3xl max-lg:text-hero-mobile lg:text-5xl text-white leading-[1.2]">
                See Our{' '}
                <span className="text-primary-500">Impact</span>
              </h1>
              <p className="text-lg text-white/70 mt-6 leading-relaxed max-w-[550px]">
                Browse through photos, videos, and press coverage showcasing our work and the communities we serve.
              </p>

              {/* Tabs */}
              <div className="flex items-center gap-2 mt-10 bg-white/10 backdrop-blur-sm rounded-pill p-1.5 max-w-md border border-white/20">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 max-lg:px-3 px-5 max-lg:text-xs py-2.5 rounded-pill text-sm font-medium transition-all duration-300 ${
                      activeTab === tab ? 'bg-primary-500 text-white shadow-soft' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {tab === 'Gallery' && <Image size={16} className="inline mr-1.5" />}
                    {tab === 'Videos' && <Play size={16} className="inline mr-1.5" />}
                    {tab === 'Press Releases' && <FileText size={16} className="inline mr-1.5" />}
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Tab */}
        {activeTab === 'Gallery' && (
          <section className="section-md bg-surface-white">
            <div className="container-content">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.map((item, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-card cursor-pointer">
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                      <Image size={40} className="text-gray-300" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <span className="text-xs font-semibold text-white/80 bg-primary-500 px-2.5 py-1 rounded-full">{item.category}</span>
                        <p className="text-sm text-white mt-2">{item.caption}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Videos Tab */}
        {activeTab === 'Videos' && (
          <section className="section-md bg-surface-white">
            <div className="container-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {videos.map((video) => (
                  <div key={video.title} className="card-hover overflow-hidden group">
                    <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                      <div className="h-16 w-16 rounded-full bg-primary-500/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Play size={24} className="text-white ml-1" />
                      </div>
                      <span className="absolute bottom-3 right-3 text-xs font-medium px-2 py-1 rounded bg-black/60 text-white">
                        {video.duration}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold font-heading text-ink-primary">{video.title}</h3>
                      <span className="text-sm text-ink-secondary mt-1 block">{video.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Press Releases Tab */}
        {activeTab === 'Press Releases' && (
          <section className="section-md bg-surface-white">
            <div className="container-content">
              <div className="space-y-6 max-w-4xl mx-auto">
                {pressReleases.map((pr) => (
                  <div key={pr.title} className="card-hover p-6 flex items-start gap-5">
                    <div className="shrink-0 h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center">
                      <FileText size={22} className="text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold font-heading text-ink-primary">{pr.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-ink-secondary">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {pr.date}</span>
                        <span>{pr.source}</span>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" className="shrink-0">Read</Button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="section-md bg-surface-section">
          <div className="container-content text-center">
            <h2 className="text-section-mobile lg:text-section text-ink-primary font-heading font-bold">Media & Press Inquiries</h2>
            <p className="text-body text-ink-secondary mt-4 max-w-xl mx-auto">For media coverage, interviews, or press-related questions, please reach out to our communications team.</p>
            <Button variant="primary" to="/contact" className="mt-8" arrow>Contact Our Team</Button>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
