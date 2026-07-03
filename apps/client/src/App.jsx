import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import KnowledgeHub from './pages/KnowledgeHub';
import ArticleDetail from './pages/ArticleDetail';
import Events from './pages/Events';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import Research from './pages/Research';
import Media from './pages/Media';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/programs" element={<Programs />} />
      <Route path="/programs/:slug" element={<ProgramDetail />} />
      <Route path="/knowledge-hub" element={<KnowledgeHub />} />
      <Route path="/knowledge-hub/:slug" element={<ArticleDetail />} />
      <Route path="/events" element={<Events />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/research" element={<Research />} />
      <Route path="/media" element={<Media />} />
    </Routes>
  );
}
