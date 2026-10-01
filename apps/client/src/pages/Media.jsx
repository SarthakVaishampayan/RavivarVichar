import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import SectionHeading from '../components/shared/SectionHeading';
import HeroSlideshow from '../components/shared/HeroSlideshow';
import Button from '../components/shared/Button';
import { Play, Image, FileText, Calendar, ArrowRight } from 'lucide-react';

const tabs = ['Gallery', 'Videos', 'Press Releases'];

const galleryItems = [
  { caption: 'Community gathering of women leaders in Central India', category: 'Field Reports', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80' },
  { caption: 'Women entrepreneurs creating handloom micro-enterprises', category: 'Enterprises', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80' },
  { caption: 'SHG federation meeting on collective savings and credit', category: 'Collectives', image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80' },
  { caption: 'Editorial field reporting team interviewing village artisans', category: 'Newsroom', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80' },
  { caption: 'Showcasing indigenous crafts and rural production', category: 'Culture', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80' },
  { caption: 'Grassroots dialogue on financial literacy and rights', category: 'Advocacy', image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80' },
  { caption: 'Documenting village outreach and women-led initiatives', category: 'Community', image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80' },
  { caption: 'Field survey on banking accessibility and digital payments', category: 'Research', image: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800&q=80' },
  { caption: 'Honoring outstanding community changemakers and rural reporters', category: 'Recognition', image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&q=80' },
];

const videos = [
  { title: 'Ravivar Vichar: Three Decades from Print to Digital Journalism', duration: '5:40', date: 'Jan 2025', thumbnail: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80' },
  { title: 'Women of Central India: Building Resilient Micro-Enterprises', duration: '8:15', date: 'Nov 2024', thumbnail: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80' },
  { title: 'The SHG Revolution: How Women Transformed Village Economies', duration: '6:45', date: 'Sep 2024', thumbnail: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80' },
  { title: 'Panchayat Pioneers: Women Transforming Local Governance', duration: '7:20', date: 'Mar 2025', thumbnail: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80' },
];

const pressReleases = [
  { title: "Ravivar Vichar's Field Investigation on Rural Credit Access Quoted in National Media", date: 'Feb 20, 2025', source: 'Press Trust of India' },
  { title: "Ground Reporting on Rural Women Enterprises Recognized by Media Foundation", date: 'Jan 15, 2025', source: 'The Hindu' },
  { title: "Digital Video Series on Women Changemakers Crosses 50 Million Digital Impressions", date: 'Dec 5, 2024', source: 'Times of India' },
  { title: "Special Investigation: How Grassroots SHGs Weathered Economic Shifts in Central India", date: 'Oct 22, 2024', source: 'Indian Express' },
];

export default function Media() {
  const [activeTab, setActiveTab] = useState('Gallery');

  return (
    <>
      <Helmet>
        <title>Media — Ravivar Vichar</title>
        <meta name="description" content="Browse photos, video documentaries, and press coverage from Ravivar Vichar's field reporting and storytelling across India." />
        <link rel="preload" as="image" href="/hero-image.webp" type="image/webp" />
      </Helmet>

      <PageLayout>
        {/* Hero */}
        <section className="relative min-h-[70vh] lg:min-h-[calc(100vh-90px)] flex items-center overflow-hidden max-md:items-start max-md:pt-[12vh] lg:items-start lg:pt-[15vh]">
          {/* Rotating hero background (gallery of all hero images) */}
          <HeroSlideshow />
          {/* Content */}
          <div className="w-full relative z-10 max-lg:px-6 pl-[5vw]">
            <div className="max-w-[580px]">
              <span className="text-sm font-semibold tracking-[0.15em] text-white/70 uppercase inline-block mb-5">MEDIA</span>
              <h1 className="text-3xl max-lg:text-hero-mobile lg:text-5xl text-white leading-[1.2]">
                See Our{' '}
                <span className="text-primary-500">Impact</span>
              </h1>
              <p className="text-lg text-white/70 mt-6 leading-relaxed max-w-[550px]">
                Browse through field photography, video documentaries, and press coverage showcasing our ground reporting and the communities we chronicle.
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
                  <div key={i} className={`group relative overflow-hidden rounded-card cursor-pointer${i === galleryItems.length - 1 ? ' md:col-span-2 md:max-w-[calc((100%-1.5rem)/2)] md:mx-auto lg:col-span-1 lg:max-w-none' : ''}`}>
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.caption}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      <span className="text-xs font-semibold text-white/90 bg-primary-500 px-2.5 py-1 rounded-full self-start mb-2">{item.category}</span>
                      <p className="text-white text-sm font-medium leading-snug">{item.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <Button variant="primary" to="/gallery" arrow>
                  View Full Interactive Gallery
                </Button>
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
                    <div className="aspect-video bg-gray-900 flex items-center justify-center relative overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        loading="lazy"
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-primary-500/90 flex items-center justify-center group-hover:scale-110 shadow-lg transition-transform duration-300">
                          <Play size={24} className="text-white ml-1" />
                        </div>
                      </div>
                      <span className="absolute bottom-3 right-3 text-xs font-medium px-2 py-1 rounded bg-black/70 text-white">
                        {video.duration}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold font-heading text-ink-primary text-base group-hover:text-primary-600 transition-colors">{video.title}</h3>
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
