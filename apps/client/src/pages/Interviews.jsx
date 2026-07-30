import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import SectionHeading from '../components/shared/SectionHeading';
import api from '../lib/axios';
import { ArrowRight, Calendar, Tag, Clock, Eye, Mic, Podcast } from 'lucide-react';

const categoryColors = {
  'Research': 'bg-primary-50 text-primary-600',
  'Case Study': 'bg-secondary-50 text-secondary-600',
  'Impact Story': 'bg-blue-50 text-blue-600',
  'Policy Brief': 'bg-red-50 text-red-500',
  'Opinion': 'bg-purple-50 text-purple-600',
  'Success Stories': 'bg-emerald-50 text-emerald-600',
  'Interview': 'bg-amber-50 text-amber-600',
  'Podcast': 'bg-orange-50 text-orange-600',
};

export default function Interviews() {
  const [loaded, setLoaded] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = '/events-hero.jpg';
    img.onload = () => setLoaded(true);
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await api.get('/articles', { params: { status: 'published', limit: 50, sort: '-createdAt' } });
        setArticles(data.data || []);
      } catch (err) {
        console.error('Failed to fetch articles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const interviews = articles.filter((a) => a.category === 'Interview');
  const podcasts = articles.filter((a) => a.category === 'Podcast');

  const getReadingTime = (content) => {
    if (!content) return 1;
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const isVideoUrl = (url) => url && (url.match(/\.(mp4|webm|ogg|mov|avi)$/i) || url.includes('cloudinary') || url.includes('video'));

  const renderCard = (article) => (
    <Link
      key={article._id}
      to={`/articles/${article.slug}`}
      className="card-hover overflow-hidden group"
    >
      <div className="h-56 bg-gray-900 relative overflow-hidden flex items-center justify-center">
        {article.videoUrl && isVideoUrl(article.videoUrl) ? (
          <>
            <video
              src={article.videoUrl}
              className="w-full h-full object-cover opacity-80"
              preload="metadata"
              muted
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors group-hover:scale-110 transition-transform duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary-500 ml-0.5">
                  <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                </svg>
              </div>
            </div>
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </>
        ) : article.thumbnail ? (
          <img src={article.thumbnail} alt={article.title} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <Mic size={36} className="text-primary-400/60" />
        )}
      </div>
      <div className="p-6">
        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[article.category] || 'bg-gray-100 text-gray-600'} mb-3`}>
          {article.category}
        </span>
        <h3 className="text-card font-heading font-bold text-ink-primary group-hover:text-primary-500 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-ink-secondary mt-3 line-clamp-2">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 text-xs text-ink-secondary">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} /> {formatDate(article.publishedAt || article.createdAt)}
          </span>
          <div className="flex items-center gap-3">
            {article.videoUrl && isVideoUrl(article.videoUrl) ? (
              <span className="flex items-center gap-1 text-primary-500 font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                </svg>
                Watch
              </span>
            ) : (
              <span className="flex items-center gap-1" title="Reading time">
                <Clock size={13} /> {getReadingTime(article.content)} min read
              </span>
            )}
            <span className="flex items-center gap-1" title="Views">
              <Eye size={13} /> {article.views || 0}
            </span>
          </div>
        </div>
      </div>
      <div className="px-6 pb-6">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 group-hover:gap-3 transition-all">
          {article.videoUrl && isVideoUrl(article.videoUrl) ? 'Watch Now' : 'Read More'} <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );

  return (
    <>
      <Helmet>
        <title>Interviews & Podcasts — Ravivar Vichar</title>
        <meta name="description" content="Exclusive interviews and podcasts featuring community leaders, experts, and changemakers in rural development." />
        <link rel="preload" as="image" href="/events-hero.jpg" />
      </Helmet>

      <PageLayout>
        {/* Hero */}
        <section className="relative min-h-[70vh] lg:min-h-[calc(100vh-90px)] flex items-start overflow-hidden max-lg:pt-[12vh] pt-[35vh]">
          <div className="absolute inset-0 bg-gray-900">
            <img
              src="/events-hero.jpg"
              alt="Interviews & Podcasts"
              onLoad={() => setLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover object-[65%_center] transition-opacity duration-1000 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(16,16,16,0.85) 0%, rgba(16,16,16,0.70) 35%, rgba(16,16,16,0.25) 70%, rgba(16,16,16,0.08) 100%)' }} />
          </div>
          <div className="w-full relative z-10 max-lg:px-6 pl-[5vw]">
            <div className="max-w-[580px]">
              <span className="text-sm font-semibold tracking-[0.15em] text-white/70 uppercase inline-block mb-5">INTERVIEWS & PODCASTS</span>
              <h1 className="text-3xl max-lg:text-hero-mobile lg:text-5xl text-white leading-[1.2]">
                Conversations That <span className="text-primary-500">Matter</span>
              </h1>
              <p className="text-lg text-white/70 mt-6 leading-relaxed max-w-[550px]">
                Exclusive interviews and podcasts with community leaders, experts, and changemakers driving rural development.
              </p>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="section-md bg-surface-white">
            <div className="container-content text-center py-16">
              <p className="text-lg text-ink-secondary">Loading content...</p>
            </div>
          </section>
        ) : (
          <>
            {/* Interviews Section */}
            <section id="interviews" className="section-md bg-surface-white scroll-mt-[110px]">
              <div className="container-content">
                <SectionHeading
                  label="INTERVIEWS"
                  title="Conversations That Matter"
                  description="Exclusive interviews with community leaders, experts, and changemakers in rural development."
                />

                {interviews.length === 0 ? (
                  <p className="text-center text-ink-secondary mt-10">No interviews published yet.</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                      {interviews.slice(0, 6).map(renderCard)}
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Podcasts Section */}
            <section id="podcasts" className="section-md bg-surface-section scroll-mt-[110px]">
              <div className="container-content">
                <SectionHeading
                  label="PODCASTS"
                  title="Listen & Learn"
                  description="Audio stories and discussions on rural development, women empowerment, and social impact."
                />

                {podcasts.length === 0 ? (
                  <p className="text-center text-ink-secondary mt-10">No podcasts published yet.</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                      {podcasts.map(renderCard)}
                    </div>
                  </>
                )}
              </div>
            </section>
          </>
        )}
      </PageLayout>
    </>
  );
}
