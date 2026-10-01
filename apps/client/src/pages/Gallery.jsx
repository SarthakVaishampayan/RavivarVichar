import { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '../components/layout/PageLayout';
import FloatingDots from '../components/shared/FloatingDots';
import api from '../lib/axios';
import { X, ChevronLeft, ChevronRight, Loader2, Calendar } from 'lucide-react';

// Stock placeholder images for when no gallery images exist yet
const stockImages = [
  { id: 'stock-1', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80', caption: 'Community gathering of women leaders in Central India', altText: 'Community gathering', summary: 'Local women leaders discussing financial literacy and self-help group initiatives.' },
  { id: 'stock-2', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80', caption: 'Women entrepreneurs at work', altText: 'Women entrepreneurs', summary: 'Entrepreneurs producing handcrafted textiles and participating in micro-finance programs.' },
  { id: 'stock-3', url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80', caption: 'SHG meeting session', altText: 'SHG meeting', summary: 'Monthly review meetings focused on savings, loan disbursement, and enterprise progress.' },
  { id: 'stock-4', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', caption: 'Our team at the field office', altText: 'Team at field office', summary: 'Field coordinators and mentors planning outreach drives across remote village clusters.' },
  { id: 'stock-5', url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80', caption: 'Traditional crafts exhibition', altText: 'Crafts exhibition', summary: 'Showcasing authentic indigenous handicraft creations at regional expos.' },
  { id: 'stock-6', url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80', caption: 'Training workshop in progress', altText: 'Training workshop', summary: 'Hands-on skill building and business planning for aspiring women entrepreneurs.' },
  { id: 'stock-7', url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80', caption: 'Village outreach program', altText: 'Village outreach', summary: 'Engaging rural households to expand awareness on women-led financial autonomy.' },
  { id: 'stock-8', url: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800&q=80', caption: 'Research field visit', altText: 'Research visit', summary: 'Collecting primary data and conducting interviews on socioeconomic impact.' },
  { id: 'stock-9', url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&q=80', caption: 'Celebrating a milestone', altText: 'Celebration', summary: 'Honoring outstanding community facilitators for their dedicated service.' },
  { id: 'stock-10', url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80', caption: 'Skill development session', altText: 'Skill development', summary: 'Vocational training sessions to enhance income-generating opportunities.' },
  { id: 'stock-11', url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&q=80', caption: 'Community event', altText: 'Community event', summary: 'An interactive gathering fostering solidarity and knowledge exchange.' },
  { id: 'stock-12', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', caption: 'Field reporting across rural clusters', altText: 'Field work', summary: 'Field journalists mapping micro-enterprise clusters and grassroots initiatives.' },
];

// Assign varying sizes for masonry effect
const sizeClasses = [
  'md:row-span-2 md:col-span-2', // hero size
  'md:row-span-2 md:col-span-1',
  'md:row-span-2 md:col-span-1',
  'md:row-span-3 md:col-span-2',
  'md:row-span-2 md:col-span-1',
  'md:row-span-1 md:col-span-1',
  'md:row-span-2 md:col-span-2',
  'md:row-span-1 md:col-span-1',
  'md:row-span-2 md:col-span-1',
  'md:row-span-2 md:col-span-1',
  'md:row-span-1 md:col-span-2',
  'md:row-span-2 md:col-span-1',
];

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await api.get('/gallery');
        const fetched = data.data || [];
        // Use fetched images if available, otherwise stock images
        setImages(fetched.length > 0 ? fetched : stockImages);
      } catch {
        setImages(stockImages);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const lastActiveElementRef = useRef(null);
  const modalContainerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const pageContentRef = useRef(null);

  const openLightbox = (index) => {
    lastActiveElementRef.current = document.activeElement;
    setLightboxIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(-1);
    setTimeout(() => {
      lastActiveElementRef.current?.focus();
    }, 10);
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Manage inert attribute and focus when lightbox opens / closes
  useEffect(() => {
    if (lightboxIndex >= 0) {
      if (pageContentRef.current) {
        pageContentRef.current.setAttribute('inert', '');
      }
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => {
        clearTimeout(timer);
        if (pageContentRef.current) {
          pageContentRef.current.removeAttribute('inert');
        }
        document.body.style.overflow = '';
      };
    }
  }, [lightboxIndex]);

  // Keyboard navigation & Focus trap for the modal
  useEffect(() => {
    if (lightboxIndex === -1) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
        return;
      }
      if (e.key === 'ArrowRight') {
        goNext();
        return;
      }
      if (e.key === 'ArrowLeft') {
        goPrev();
        return;
      }
      if (e.key === 'Tab' && modalContainerRef.current) {
        const focusable = modalContainerRef.current.querySelectorAll(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !modalContainerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !modalContainerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, closeLightbox, goNext, goPrev]);

  return (
    <>
      <Helmet>
        <title>Gallery — Ravivar Vichar</title>
        <meta name="description" content="Explore our photo gallery documenting grassroots changemakers, women entrepreneurs, and rural communities across Central India." />
      </Helmet>

      <div ref={pageContentRef}>
        <PageLayout>
          <section className="relative overflow-hidden bg-surface-secondary max-lg:py-16 py-24 lg:py-28">
            <FloatingDots />
            <div className="container-content relative z-10">
              <div className="max-w-3xl">
                <span className="section-label">GALLERY</span>
                <h1 className="text-hero-mobile lg:text-hero text-ink-primary mt-4 leading-tight">
                  Moments That <span className="text-primary-500">Matter</span>
                </h1>
                <p className="text-body text-ink-secondary mt-6 max-w-2xl">
                  A visual journey through our work — capturing the spirit of community, entrepreneurship, and change across grassroots India.
                </p>
              </div>
            </div>
          </section>

          <section className="section-md bg-surface-white">
            <div className="container-content">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 size={32} className="animate-spin text-primary-500" />
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-lg text-ink-secondary">No images in the gallery yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
                  {images.map((img, index) => {
                    const sizeClass = sizeClasses[index % sizeClasses.length];
                    const isLarge = sizeClass.includes('md:col-span-2');
                    const cardTitle = img.title || img.caption || img.altText || '';
                    return (
                      <button
                        key={img._id || img.id}
                        type="button"
                        onClick={() => openLightbox(index)}
                        aria-label={`View photo: ${cardTitle || `Photo ${index + 1}`}`}
                        className={`relative overflow-hidden rounded-xl group cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${sizeClass} ${
                          isLarge ? 'md:col-span-2 md:row-span-2' : ''
                        }`}
                      >
                        <img
                          src={img.imageUrl || img.url}
                          alt={img.altText || cardTitle || 'Gallery image'}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          {cardTitle && (
                            <p className="text-white text-sm font-medium leading-snug line-clamp-2 drop-shadow-sm">
                              {cardTitle}
                            </p>
                          )}
                          {img.summary && (
                            <p className="text-white/80 text-xs line-clamp-1 mt-1">
                              {img.summary}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </PageLayout>
      </div>

      {/* Enhanced Lightbox Modal */}
      {lightboxIndex >= 0 && images[lightboxIndex] && (() => {
        const currentImg = images[lightboxIndex];
        const displayTitle = currentImg.title || currentImg.caption || currentImg.altText || 'Gallery photo';
        const displayCaption = currentImg.caption && currentImg.caption !== displayTitle ? currentImg.caption : '';
        const displaySummary = currentImg.summary || '';
        const displayDate = currentImg.customDate || currentImg.createdAt;

        return (
          <div
            ref={modalContainerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-dialog-title"
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors z-20 backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              aria-label="Close photo view"
            >
              <X size={22} aria-hidden="true" />
            </button>

            {/* Prev Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 sm:p-3 rounded-full transition-colors z-20 backdrop-blur-sm shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                aria-label="Previous photo"
              >
                <ChevronLeft size={28} aria-hidden="true" />
              </button>
            )}

            {/* Next Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 sm:p-3 rounded-full transition-colors z-20 backdrop-blur-sm shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                aria-label="Next photo"
              >
                <ChevronRight size={28} aria-hidden="true" />
              </button>
            )}

            {/* Modal Dialog Card */}
            <div
              className="relative max-w-4xl w-full max-h-[92vh] flex flex-col items-center overflow-y-auto rounded-2xl bg-neutral-900/90 border border-white/15 shadow-2xl p-4 sm:p-6 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Photo Display */}
              <div className="w-full flex items-center justify-center overflow-hidden rounded-xl bg-black/40 mb-4 max-h-[58vh]">
                <img
                  src={currentImg.imageUrl || currentImg.url}
                  alt={currentImg.altText || displayTitle || 'Gallery photo'}
                  className="max-h-[58vh] w-auto max-w-full object-contain rounded-lg shadow-md"
                />
              </div>

              {/* Photo Information & Supporting Context */}
              <div className="w-full space-y-3 px-1 sm:px-2 text-left">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h2
                    id="gallery-dialog-title"
                    className="text-lg sm:text-xl font-semibold font-serif text-white tracking-wide"
                  >
                    {displayTitle}
                  </h2>

                  <div className="flex items-center gap-2 text-xs text-white/60">
                    {displayDate && (
                      <span className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-white/80">
                        <Calendar size={13} className="text-primary-400" />
                        {new Date(displayDate).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                    <span className="bg-white/10 px-2.5 py-1 rounded-full text-white/80 font-mono">
                      {lightboxIndex + 1} / {images.length}
                    </span>
                  </div>
                </div>

                {displayCaption && (
                  <p className="text-sm font-medium text-primary-300 italic">
                    "{displayCaption}"
                  </p>
                )}

                {displaySummary && (
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-light whitespace-pre-line">
                      {displaySummary}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}

