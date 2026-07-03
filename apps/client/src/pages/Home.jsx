import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import Mission from '../components/home/Mission';
import ProgramsGrid from '../components/home/ProgramsGrid';
import FeaturedResearch from '../components/home/FeaturedResearch';
import LatestArticles from '../components/home/LatestArticles';
import ImpactStats from '../components/home/ImpactStats';
import CurrentProjects from '../components/home/CurrentProjects';
import Partners from '../components/home/Partners';
import VideosSection from '../components/home/VideosSection';
import Testimonials from '../components/home/Testimonials';
import EventsPreview from '../components/home/EventsPreview';
import MembershipCTA from '../components/home/MembershipCTA';
import DonateCTA from '../components/home/DonateCTA';
import Newsletter from '../components/home/Newsletter';
import api from '../lib/axios';

// Map section keys to their components
const SECTION_COMPONENTS = {
  hero: Hero,
  mission: Mission,
  programs: ProgramsGrid,
  research: FeaturedResearch,
  articles: LatestArticles,
  stats: ImpactStats,
  projects: CurrentProjects,
  partners: Partners,
  videos: VideosSection,
  testimonials: Testimonials,
  events: EventsPreview,
  membership: MembershipCTA,
  donate: DonateCTA,
  newsletter: Newsletter,
};

// Default order when no server data exists yet
const DEFAULT_SECTIONS = [
  'hero', 'mission', 'programs', 'research', 'articles',
  'stats', 'projects', 'partners', 'videos', 'testimonials',
  'events', 'membership', 'donate', 'newsletter',
];

export default function Home() {
  const [sectionKeys, setSectionKeys] = useState(DEFAULT_SECTIONS);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const { data } = await api.get('/homepage');
        if (data.success && data.data && data.data.length > 0) {
          const ordered = data.data
            .filter((s) => s.visible !== false)
            .sort((a, b) => a.order - b.order)
            .map((s) => s.key);
          setSectionKeys(ordered);
          return;
        }
      } catch {
        // Server not available — use defaults
      }
    };
    fetchSections();
  }, []);

  return (
    <>
      <Helmet>
        <title>RavivarVichar — Empowering Rural Communities</title>
        <meta name="description" content="RavivarVichar empowers rural communities through research, entrepreneurship, and self-help groups. Working across Rajasthan for sustainable development." />
        <meta property="og:title" content="RavivarVichar — Empowering Rural Communities" />
        <meta property="og:description" content="Empowering rural communities through research, entrepreneurship, and self-help groups." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NGO',
            name: 'RavivarVichar',
            description: 'Empowering rural communities through research, entrepreneurship, and self-help groups.',
            url: 'https://ravivarvichar.org',
            logo: 'https://ravivarvichar.org/logo.png',
            location: { '@type': 'Place', address: { '@type': 'PostalAddress', addressRegion: 'Rajasthan', addressCountry: 'IN' } },
          })}
        </script>
      </Helmet>

      <Navbar />

      <main>
        {sectionKeys.map((key) => {
          const SectionComponent = SECTION_COMPONENTS[key];
          return SectionComponent ? <SectionComponent key={key} /> : null;
        })}
      </main>

      <Footer />
    </>
  );
}
