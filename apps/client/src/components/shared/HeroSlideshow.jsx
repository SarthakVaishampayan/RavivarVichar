import { useEffect, useRef, useState } from 'react';

// ─── Hero image gallery ───
// All hero images currently used across the site. Add new images to this array
// to include them in the rotating hero on every page.
export const HERO_IMAGES = [
  { src: '/hero-image.jpg', alt: 'Ravivar Vichar community work' },
  { src: '/about-hero.jpg', alt: 'About Ravivar Vichar' },
  { src: '/contact-hero.jpg', alt: 'Contact Ravivar Vichar' },
  { src: '/articles-hero.jpg', alt: 'Knowledge hub — articles and research' },
  { src: '/events-hero.jpg', alt: 'Ravivar Vichar events' },
  { src: '/partner-hero.jpg', alt: 'Partner with Ravivar Vichar' },
  { src: '/join-hero.jpg', alt: 'Join the initiative' },
  { src: '/whatwedo-hero.jpg', alt: 'What we do at Ravivar Vichar' },
  { src: '/featured-hero.jpg', alt: 'Featured stories and recognitions' },
  { src: '/knowledge-hero.jpg', alt: 'Knowledge hub' },
];

const SLIDE_INTERVAL_MS = 5000;
const CROSSFADE_MS = 1500;

// Default gradient used by every hero on the site (text readability).
const DEFAULT_GRADIENT =
  'linear-gradient(90deg, rgba(16,16,16,0.85) 0%, rgba(16,16,16,0.70) 35%, rgba(16,16,16,0.25) 70%, rgba(16,16,16,0.08) 100%)';

/**
 * Rotating hero background — drops into any page hero that currently has a
 * single background image. Crossfades between images every 5s, with a subtle
 * Ken Burns zoom, dot navigation and prefers-reduced-motion support. The
 * overlay gradient stays on top for text readability.
 *
 * All images stay mounted and crossfade purely via CSS opacity transitions —
 * the transition always animates because the elements already exist.
 */
export default function HeroSlideshow({
  images = HERO_IMAGES,
  gradient = DEFAULT_GRADIENT,
  wrapperClass = 'bg-gray-900',
  imageClass = '',
  startIndex = 0,
}) {
  const [active, setActive] = useState(startIndex % images.length);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [timerKey, setTimerKey] = useState(0); // bump to restart the 5s timer
  // zoomReady[idx] = true once the image has been reset to scale(1) and its
  // 5s zoom transition is armed. The newly-active image briefly resets to
  // scale(1), then zooms to scale(1.08) over the full slide duration and HOLDS
  // (never shrinks back) — so the crossfade happens while still zoomed in.
  const [zoomReady, setZoomReady] = useState({});
  const activeRef = useRef(startIndex % images.length);
  const timerRef = useRef(null);

  // Respect prefers-reduced-motion (no autoplay / no animation).
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handle = (e) => setReducedMotion(e.matches);
    setReducedMotion(mq.matches);
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, []);

  // Preload every hero image once so crossfades never flash blank.
  useEffect(() => {
    images.forEach((img) => {
      const el = new Image();
      el.src = img.src;
    });
  }, [images]);

  const goTo = (idx) => {
    const next = ((idx % images.length) + images.length) % images.length;
    if (next === activeRef.current) return;
    activeRef.current = next;
    setActive(next);
    setTimerKey((k) => k + 1); // reset the auto-advance timer
  };

  // Auto-advance every 5s; skipped for reduced motion (manual dots still work).
  useEffect(() => {
    if (images.length <= 1 || reducedMotion) return undefined;
    timerRef.current = setInterval(() => {
      const next = (activeRef.current + 1) % images.length;
      activeRef.current = next;
      setActive(next);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [images.length, reducedMotion, timerKey]);

  // Restart the zoom for the newly active slide: first render it at scale(1)
  // with no transition, then on the next frame arm the 5s zoom to scale(1.08).
  useEffect(() => {
    setZoomReady((z) => ({ ...z, [active]: false }));
    const raf = requestAnimationFrame(() => {
      setZoomReady((z) => ({ ...z, [active]: true }));
    });
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${wrapperClass}`}>
      {images.map((img, idx) => {
        const isActive = idx === active;
        // Zoom holds at 1.08 once armed (never retracts while fading out); only
        // the brief reset phase dips back to scale(1) before the next zoom.
        const zoomed = !reducedMotion && zoomReady[idx];
        const armed = !reducedMotion && isActive && zoomReady[idx];
        return (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            aria-hidden={!isActive}
            style={{
              transition: `opacity ${reducedMotion ? '0ms' : `${CROSSFADE_MS}ms`} ease${
                armed ? `, transform ${SLIDE_INTERVAL_MS}ms linear` : ''
              }`,
              transform: zoomed ? 'scale(1.08)' : 'scale(1)',
              opacity: isActive ? 1 : 0,
              willChange: 'opacity, transform',
            }}
            className={`absolute inset-0 w-full h-full object-cover ${imageClass}`}
          />
        );
      })}

      {/* Gradient overlay — stays above the images for text readability */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: gradient }} />

      {/* Dot navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 z-10">
          {images.map((img, idx) => (
            <button
              key={img.src}
              type="button"
              onClick={() => goTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === active ? 'w-6 bg-primary-400' : 'w-2 bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
