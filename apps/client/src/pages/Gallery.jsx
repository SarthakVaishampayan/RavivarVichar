import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import FloatingDots from '../components/shared/FloatingDots';
import api from '../lib/axios';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

// Stock placeholder images for when no gallery images exist yet
const stockImages = [
  { id: 'stock-1', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80', caption: 'Community gathering in rural Rajasthan', altText: 'Community gathering' },
  { id: 'stock-2', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80', caption: 'Women entrepreneurs at work', altText: 'Women entrepreneurs' },
  { id: 'stock-3', url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80', caption: 'SHG meeting session', altText: 'SHG meeting' },
  { id: 'stock-4', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', caption: 'Our team at the field office', altText: 'Team at field office' },
  { id: 'stock-5', url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80', caption: 'Traditional crafts exhibition', altText: 'Crafts exhibition' },
  { id: 'stock-6', url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80', caption: 'Training workshop in progress', altText: 'Training workshop' },
  { id: 'stock-7', url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80', caption: 'Village outreach program', altText: 'Village outreach' },
  { id: 'stock-8', url: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800&q=80', caption: 'Research field visit', altText: 'Research visit' },
  { id: 'stock-9', url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&q=80', caption: 'Celebrating a milestone', altText: 'Celebration' },
  { id: 'stock-10', url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80', caption: 'Skill development session', altText: 'Skill development' },
  { id: 'stock-11', url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&q=80', caption: 'Community event', altText: 'Community event' },
  { id: 'stock-12', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', caption: 'Field work in Rajasthan', altText: 'Field work' },
];

// Assign varying sizes for masonry effect
const sizeClasses = [
  'row-span-2 col-span-2', // hero size
  'row-span-2 col-span-1',
  'row-span-2 col-span-1',
  'row-span-3 col-span-2',
  'row-span-2 col-span-1',
  'row-span-1 col-span-1',
  'row-span-2 col-span-2',
  'row-span-1 col-span-1',
  'row-span-2 col-span-1',
  'row-span-2 col-span-1',
  'row-span-1 col-span-2',
  'row-span-2 col-span-1',
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

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(-1);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxIndex === -1) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, goNext, goPrev]);

  return (
    <>
      <Helmet>
        <title>Gallery — RavivarVichar</title>
        <meta name="description" content="Explore our photo gallery showcasing the impact of our work across rural communities in Rajasthan." />
      </Helmet>

      <PageLayout>
        <section className="relative overflow-hidden bg-surface-secondary py-24 lg:py-28">
          <FloatingDots />
          <div className="container-content relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-ink-secondary hover:text-primary-500 transition-colors mb-8">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <div className="max-w-3xl">
              <span className="section-label">GALLERY</span>
              <h1 className="text-hero-mobile lg:text-hero text-ink-primary mt-4 leading-tight">
                Moments That <span className="text-primary-500">Matter</span>
              </h1>
              <p className="text-body text-ink-secondary mt-6 max-w-2xl">
                A visual journey through our work — capturing the spirit of community, entrepreneurship, and change across rural Rajasthan.
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
                  const isLarge = sizeClass.includes('col-span-2');
                  return (
                    <button
                      key={img._id || img.id}
                      onClick={() => openLightbox(index)}
                      className={`relative overflow-hidden rounded-xl group cursor-pointer ${sizeClass} ${
                        isLarge ? 'md:col-span-2 md:row-span-2' : ''
                      }`}
                    >
                      <img
                        src={img.imageUrl || img.url}
                        alt={img.altText || img.caption || 'Gallery image'}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white text-sm font-medium text-left leading-tight line-clamp-2">
                            {img.caption || img.altText || ''}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </PageLayout>

      {/* Lightbox */}
      {lightboxIndex >= 0 && images[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
            aria-label="Close"
          >
            <X size={28} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10 p-2"
            aria-label="Previous"
          >
            <ChevronLeft size={40} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10 p-2"
            aria-label="Next"
          >
            <ChevronRight size={40} />
          </button>

          <div className="max-w-[90vw] max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightboxIndex].imageUrl || images[lightboxIndex].url}
              alt={images[lightboxIndex].altText || images[lightboxIndex].caption || 'Gallery image'}
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />
            {(images[lightboxIndex].caption || images[lightboxIndex].altText) && (
              <p className="text-white/80 text-sm mt-4 text-center max-w-lg">
                {images[lightboxIndex].caption || images[lightboxIndex].altText}
              </p>
            )}
            <p className="text-white/40 text-xs mt-2">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
