import { useEffect, useRef, useState } from 'react';

// ─── Hero image gallery ───
// All hero images currently used across the site with optimized WebP and fallback JPEG.
export const HERO_IMAGES = [
  { src: '/hero-image.jpg', webp: '/hero-image.webp', alt: 'Ravivar Vichar community work' },
  { src: '/about-hero.jpg', webp: '/about-hero.webp', alt: 'About Ravivar Vichar' },
  { src: '/contact-hero.jpg', webp: '/contact-hero.webp', alt: 'Contact Ravivar Vichar' },
  { src: '/articles-hero.jpg', webp: '/articles-hero.webp', alt: 'Knowledge hub — articles and research' },
  { src: '/events-hero.jpg', webp: '/events-hero.webp', alt: 'Ravivar Vichar events' },
  { src: '/partner-hero.jpg', webp: '/partner-hero.webp', alt: 'Partner with Ravivar Vichar' },
  { src: '/join-hero.jpg', webp: '/join-hero.webp', alt: 'Join the initiative' },
  { src: '/whatwedo-hero.jpg', webp: '/whatwedo-hero.webp', alt: 'What we do at Ravivar Vichar' },
  { src: '/featured-hero.jpg', webp: '/featured-hero.webp', alt: 'Featured stories and recognitions' },
  { src: '/knowledge-hero.jpg', webp: '/knowledge-hero.webp', alt: 'Knowledge hub' },
];

const SLIDE_INTERVAL_MS = 5000;
const CROSSFADE_MS = 1500;

// Default gradient used by every hero on the site (text readability).
const DEFAULT_GRADIENT =
  'linear-gradient(90deg, rgba(16,16,16,0.85) 0%, rgba(16,16,16,0.70) 35%, rgba(16,16,16,0.25) 70%, rgba(16,16,16,0.08) 100%)';

/**
 * Rotating hero background — drops into any page hero.
 * Optimized for Web Vitals:
 * - Loads only the initial slide on page mount (drastically cuts LCP and payload).
 * - Preloads the next upcoming slide 2 seconds before the transition.
 * - Uses responsive WebP format with JPEG fallback.
 * - Touch-accessible dot controls and prefers-reduced-motion support.
 */
export default function HeroSlideshow({
  images = HERO_IMAGES,
  gradient = DEFAULT_GRADIENT,
  wrapperClass = 'bg-gray-900',
  imageClass = '',
  startIndex = 0,
}) {
  const initialIndex = startIndex % images.length;
  const [active, setActive] = useState(initialIndex);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  // Keep track of which slide indices have been loaded.
  // Initially, only the starting slide is loaded.
  const [loadedIndices, setLoadedIndices] = useState(() => ({ [initialIndex]: true }));

  const [zoomReady, setZoomReady] = useState({});
  const activeRef = useRef(initialIndex);
  const timerRef = useRef(null);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handle = (e) => setReducedMotion(e.matches);
    setReducedMotion(mq.matches);
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, []);

  // Preload next upcoming slide just in time so crossfades are seamless without downloading all 10 at once
  useEffect(() => {
    if (images.length <= 1) return;
    const nextIdx = (active + 1) % images.length;
    setLoadedIndices((prev) => (prev[nextIdx] ? prev : { ...prev, [nextIdx]: true }));
  }, [active, images.length]);

  const goTo = (idx) => {
    const next = ((idx % images.length) + images.length) % images.length;
    if (next === activeRef.current) return;
    activeRef.current = next;
    setLoadedIndices((prev) => ({ ...prev, [next]: true }));
    setActive(next);
    setTimerKey((k) => k + 1);
  };

  // Auto-advance every 5s; paused if reduced motion or user hovers
  useEffect(() => {
    if (images.length <= 1 || reducedMotion || isPaused) return undefined;
    timerRef.current = setInterval(() => {
      const next = (activeRef.current + 1) % images.length;
      activeRef.current = next;
      setLoadedIndices((prev) => ({ ...prev, [next]: true }));
      setActive(next);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [images.length, reducedMotion, isPaused, timerKey]);

  // Restart zoom for the newly active slide
  useEffect(() => {
    setZoomReady((z) => ({ ...z, [active]: false }));
    const raf = requestAnimationFrame(() => {
      setZoomReady((z) => ({ ...z, [active]: true }));
    });
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${wrapperClass}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {images.map((img, idx) => {
        const isActive = idx === active;
        const isLoaded = loadedIndices[idx] || isActive;
        const zoomed = !reducedMotion && zoomReady[idx];
        const armed = !reducedMotion && isActive && zoomReady[idx];

        if (!isLoaded) return null;

        return (
          <picture
            key={img.src}
            aria-hidden={!isActive}
            style={{
              transition: `opacity ${reducedMotion ? '0ms' : `${CROSSFADE_MS}ms`} ease`,
              opacity: isActive ? 1 : 0,
              willChange: 'opacity',
            }}
            className="absolute inset-0 w-full h-full"
          >
            {img.webp && <source srcSet={img.webp} type="image/webp" />}
            <img
              src={img.src}
              alt={img.alt}
              loading={idx === initialIndex ? 'eager' : 'lazy'}
              fetchPriority={idx === initialIndex ? 'high' : 'low'}
              style={{
                transition: armed ? `transform ${SLIDE_INTERVAL_MS}ms linear` : 'none',
                transform: zoomed ? 'scale(1.08)' : 'scale(1)',
                willChange: 'transform',
              }}
              className={`w-full h-full object-cover ${imageClass}`}
            />
          </picture>
        );
      })}

      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: gradient }} />

      {/* Dot navigation with accessible touch target (min 32px height) */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-1 z-10">
          {images.map((img, idx) => (
            <button
              key={img.src}
              type="button"
              onClick={() => goTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === active ? 'true' : 'false'}
              className="p-2.5 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-full"
            >
              <span
                className={`h-2 rounded-full transition-all duration-300 block ${
                  idx === active ? 'w-6 bg-primary-400' : 'w-2 bg-white/40 hover:bg-white/80'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
