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

export default function Home() {
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

      <main className="pt-[90px]">
        <Hero />
        <Mission />
        <ProgramsGrid />
        <FeaturedResearch />
        <LatestArticles />
        <ImpactStats />
        <CurrentProjects />
        <Partners />
        <VideosSection />
        <Testimonials />
        <EventsPreview />
        <MembershipCTA />
        <DonateCTA />
        <Newsletter />
      </main>

      <Footer />
    </>
  );
}
