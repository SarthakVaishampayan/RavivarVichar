import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import ImpactStats from '../components/home/ImpactStats';
import WhatWeDo from '../components/home/ProgramsGrid';
import SuccessStories from '../components/home/FeaturedResearch';
import Partners from '../components/home/Partners';
import Recognitions from '../components/home/Recognitions';
import Testimonials from '../components/home/Testimonials';
import api from '../lib/axios';

const sectionComponents = {
  hero: Hero,
  impactStats: ImpactStats,
  programs: WhatWeDo,
  research: SuccessStories,
  partners: Partners,
  recognitions: Recognitions,
  testimonials: Testimonials,
};

const defaultSections = [
  { key: 'hero', order: 0, visible: true },
  { key: 'impactStats', order: 1, visible: true },
  { key: 'programs', order: 2, visible: true },
  { key: 'research', order: 3, visible: true },
  { key: 'partners', order: 4, visible: true },
  { key: 'recognitions', order: 5, visible: true },
  { key: 'testimonials', order: 6, visible: true },
];

export default function Home() {
  const [sections, setSections] = useState(defaultSections);

  useEffect(() => {
    api.get('/homepage')
      .then(({ data }) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          // Merge server data with defaults for any missing sections
          const serverMap = {};
          data.data.forEach((s) => { serverMap[s.key] = s; });

          const merged = defaultSections.map((def) => ({
            ...def,
            ...(serverMap[def.key] ? { order: serverMap[def.key].order, visible: serverMap[def.key].visible } : {}),
          }));

          merged.sort((a, b) => a.order - b.order);
          setSections(merged);
        }
      })
      .catch(() => {
        // Fall back to defaults on error
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>Ravivar Vichar — Independent Journalism & Grassroots Stories</title>
        <meta name="description" content="Ravivar Vichar covers inspiring stories of grassroots changemakers, women entrepreneurs, rural innovation, and social change across India." />
        <link rel="canonical" href="https://ravivarvichar.in" />
        <meta property="og:title" content="Ravivar Vichar — Independent Journalism & Grassroots Stories" />
        <meta property="og:description" content="Ravivar Vichar covers inspiring stories of grassroots changemakers, women entrepreneurs, rural innovation, and social change across India." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ravivarvichar.in" />
        <meta property="og:image" content="https://ravivarvichar.in/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ravivar Vichar — Independent Journalism & Grassroots Stories" />
        <meta name="twitter:description" content="Ravivar Vichar covers inspiring stories of grassroots changemakers, women entrepreneurs, rural innovation, and social change across India." />
        <meta name="twitter:image" content="https://ravivarvichar.in/logo.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsMediaOrganization',
            name: 'Ravivar Vichar',
            alternateName: 'रविवार विचार',
            description: 'Independent digital publication documenting grassroots transformation, women entrepreneurs, and social changemakers.',
            url: 'https://ravivarvichar.in',
            logo: {
              '@type': 'ImageObject',
              url: 'https://ravivarvichar.in/logo.png',
            },
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Indore',
              addressRegion: 'Madhya Pradesh',
              addressCountry: 'IN',
            },
          })}
        </script>
      </Helmet>

      <Navbar />

      <main>
        {(() => {
          // Automatically alternate backgrounds (white ↔ colored) for visible
          // sections, regardless of which sections are hidden in the builder.
          // The hero keeps its own dark full-screen image.
          let bandIndex = -1;
          return sections
            .filter((s) => s.visible && sectionComponents[s.key])
            .map((s) => {
              const Component = sectionComponents[s.key];
              if (s.key !== 'hero') bandIndex += 1;
              const bgClass =
                s.key === 'hero'
                  ? undefined
                  : bandIndex % 2 === 0
                    ? 'bg-surface-white'
                    : 'bg-surface-section';
              return <Component key={s.key} bgClass={bgClass} />;
            });
        })()}
      </main>

      <Footer />
    </>
  );
}
