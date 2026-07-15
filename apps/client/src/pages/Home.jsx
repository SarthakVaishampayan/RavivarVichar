import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import ImpactStats from '../components/home/ImpactStats';
import WhatWeDo from '../components/home/ProgramsGrid';
import SuccessStories from '../components/home/FeaturedResearch';
import Partners from '../components/home/Partners';
import MediaMentions from '../components/home/MediaMentions';
import Testimonials from '../components/home/Testimonials';
import api from '../lib/axios';

const sectionComponents = {
  hero: Hero,
  impactStats: ImpactStats,
  programs: WhatWeDo,
  research: SuccessStories,
  partners: Partners,
  mediaMentions: MediaMentions,
  testimonials: Testimonials,
};

const defaultSections = [
  { key: 'hero', order: 0, visible: true },
  { key: 'impactStats', order: 1, visible: true },
  { key: 'programs', order: 2, visible: true },
  { key: 'research', order: 3, visible: true },
  { key: 'partners', order: 4, visible: true },
  { key: 'mediaMentions', order: 5, visible: true },
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
        <title>Ravivar Vichar — Empowering Rural Communities</title>
        <meta name="description" content="Ravivar Vichar empowers rural communities through research, entrepreneurship, and self-help groups. Working across Rajasthan for sustainable development." />
        <meta property="og:title" content="Ravivar Vichar — Empowering Rural Communities" />
        <meta property="og:description" content="Empowering rural communities through research, entrepreneurship, and self-help groups." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NGO',
            name: 'Ravivar Vichar',
            description: 'Empowering rural communities through research, entrepreneurship, and self-help groups.',
            url: 'https://ravivarvichar.org',
            logo: 'https://ravivarvichar.org/logo.png', /* ⚠️ Replace with actual logo URL after uploading */
            location: { '@type': 'Place', address: { '@type': 'PostalAddress', addressRegion: 'Madhya Pradesh', addressCountry: 'IN' } },
          })}
        </script>
      </Helmet>

      <Navbar />

      <main>
        {sections
          .filter((s) => s.visible && sectionComponents[s.key])
          .map((s) => {
            const Component = sectionComponents[s.key];
            return <Component key={s.key} />;
          })}
      </main>

      <Footer />
    </>
  );
}
