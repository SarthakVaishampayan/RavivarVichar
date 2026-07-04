import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/layout/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import KnowledgeHub from './pages/KnowledgeHub';
import KnowledgeHubSection from './pages/KnowledgeHubSection';
import ArticleDetail from './pages/ArticleDetail';
import Events from './pages/Events';
import Contact from './pages/Contact';
import Media from './pages/Media';
import GetFeatured from './pages/GetFeatured';
import JoinInitiative from './pages/JoinInitiative';
import Gallery from './pages/Gallery';
import PartnerWithUs from './pages/PartnerWithUs';
import WhatWeDoDetail from './pages/WhatWeDoDetail';
import MediaMentions from './pages/MediaMentions';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/knowledge-hub" element={<KnowledgeHub />} />
      <Route path="/knowledge-hub/section/:sectionId" element={<KnowledgeHubSection />} />
      <Route path="/knowledge-hub/:slug" element={<ArticleDetail />} />
      <Route path="/events" element={<Events />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/media" element={<Media />} />
      <Route path="/get-featured" element={<GetFeatured />} />
      <Route path="/join-our-initiative" element={<JoinInitiative />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/partner-with-us" element={<PartnerWithUs />} />
      <Route path="/what-we-do/:slug" element={<WhatWeDoDetail />} />
      <Route path="/media-mentions" element={<MediaMentions />} />
    </Routes>
    </>
  );
}
