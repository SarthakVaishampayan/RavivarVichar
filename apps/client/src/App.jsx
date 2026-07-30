import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/layout/ScrollToTop';
import usePageviewTracking from './hooks/usePageviewTracking';
import Home from './pages/Home';
import About from './pages/About';
import ArticlesHub from './pages/ArticlesHub';
import ArticlesSection from './pages/ArticlesSection';
import ArticleDetail from './pages/ArticleDetail';
import Interviews from './pages/Interviews';
import Contact from './pages/Contact';
import Media from './pages/Media';
import GetFeatured from './pages/GetFeatured';
import Events from './pages/Events';
import JoinInitiative from './pages/JoinInitiative';
import Gallery from './pages/Gallery';
import PartnerWithUs from './pages/PartnerWithUs';
import WhatWeDoDetail from './pages/WhatWeDoDetail';
import Recognitions from './pages/Recognitions';
import RecognitionDetail from './pages/RecognitionDetail';
import FAQ from './pages/FAQ';

function PageviewTracker() {
  usePageviewTracking();
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <PageviewTracker />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/articles" element={<ArticlesHub />} />
      <Route path="/articles/section/:sectionId" element={<ArticlesSection />} />
      <Route path="/articles/:slug" element={<ArticleDetail />} />
      <Route path="/interviews" element={<Interviews />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/media" element={<Media />} />
      <Route path="/get-featured" element={<GetFeatured />} />
      <Route path="/join-our-initiative" element={<JoinInitiative />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/partner-with-us" element={<PartnerWithUs />} />
      <Route path="/what-we-do/:slug" element={<WhatWeDoDetail />} />
      <Route path="/recognitions" element={<Recognitions />} />
      <Route path="/recognitions/:slug" element={<RecognitionDetail />} />
      <Route path="/events" element={<Events />} />
      <Route path="/faq" element={<FAQ />} />
    </Routes>
    </>
  );
}
