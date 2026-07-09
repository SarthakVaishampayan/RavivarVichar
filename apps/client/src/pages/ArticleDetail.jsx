import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/shared/Button';
import { ArrowLeft, Calendar, User, Linkedin, Twitter, Facebook } from 'lucide-react';
import api from '../lib/axios';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await api.get(`/articles/slug/${slug}`);
        setArticle(data.data);
        // Fetch related articles
        const { data: related } = await api.get('/articles', { params: { status: 'published', limit: 4 } });
        setRelatedArticles((related.data || []).filter((a) => a.slug !== slug).slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch article:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <PageLayout>
        <div className="container-content py-32 text-center">
          <p className="text-lg text-ink-secondary">Loading article...</p>
        </div>
      </PageLayout>
    );
  }

  if (!article) {
    return (
      <PageLayout>
        <div className="container-content py-32 text-center">
          <h1 className="text-3xl font-heading font-bold text-ink-primary">Article Not Found</h1>
          <p className="text-body text-ink-secondary mt-4">The article you're looking for doesn't exist.</p>
          <Button variant="primary" to="/knowledge-hub" className="mt-8">Back to Knowledge Hub</Button>
        </div>
      </PageLayout>
    );
  }

  const authorName = article.author?.name || 'Ravivar Vichar Team';
  const formattedDate = article.publishedAt || article.createdAt
    ? new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : '';

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/article-hero.jpg';
    img.onload = () => setLoaded(true);
  }, []);

  return (
    <>
      <Helmet>
        <title>{article.title} — Ravivar Vichar</title>
        <meta name="description" content={(article.excerpt || article.content || '').replace(/<[^>]*>/g, '').slice(0, 160)} />
      <link rel="preload" as="image" href="/article-hero.jpg" />
      </Helmet>

      <PageLayout>
        <section className="relative min-h-[70vh] lg:min-h-[calc(100vh-90px)] flex items-start overflow-hidden pt-[15vh]">
          {/* Background image */}
          <div className="absolute inset-0 bg-gray-900">
            <img
  src="/article-hero.jpg"
  alt=""
  onLoad={() => setLoaded(true)}
  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
    loaded ? 'opacity-100' : 'opacity-0'
  }`}
/>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(16,16,16,0.85) 0%, rgba(16,16,16,0.70) 35%, rgba(16,16,16,0.25) 70%, rgba(16,16,16,0.08) 100%)' }} />
          </div>
          {/* Content */}
          <div className="w-full relative z-10 pl-[5vw]">
            <div className="max-w-[580px]">
              <Link to="/knowledge-hub" className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors mb-8">
                <ArrowLeft size={16} /> Back to Knowledge Hub
              </Link>
              <span className="block text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/90 backdrop-blur-sm mb-4 w-fit">
                {article.category}
              </span>
              <h1 className="text-3xl lg:text-5xl text-white leading-[1.2] font-heading font-bold">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-5 mt-6 text-sm text-white/70">
                <span className="flex items-center gap-1.5"><User size={16} /> {authorName}</span>
                <span className="flex items-center gap-1.5"><Calendar size={16} /> {formattedDate}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-white">
          <div className="container-content">
            {article.thumbnail && (
              <div className="-mt-16 rounded-xl overflow-hidden shadow-xl max-w-4xl mx-auto">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-auto max-h-[500px] object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {article.videoUrl && (
              <div className="max-w-4xl mx-auto mt-8">
                <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    src={article.videoUrl.includes('watch?v=')
                      ? article.videoUrl.replace('watch?v=', 'embed/')
                      : article.videoUrl.includes('youtu.be/')
                        ? article.videoUrl.replace('youtu.be/', 'youtube.com/embed/')
                        : article.videoUrl.includes('youtube.com/embed/')
                          ? article.videoUrl
                          : article.videoUrl
                    }
                    title={article.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>
            )}

            {article.gallery && article.gallery.length > 0 && (
              <div className="max-w-4xl mx-auto mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                {article.gallery.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${article.title} - Image ${i + 1}`}
                    className="w-full h-40 object-cover rounded-lg shadow-sm"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="section-md bg-surface-white">
          <div className="container-content">
            <div className="flex gap-12 max-w-5xl mx-auto">
              <div className="hidden lg:flex flex-col items-center gap-4 pt-4 sticky top-[120px] h-fit">
                <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">Share</span>
                <button className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-ink-secondary hover:bg-primary-500 hover:text-white transition-all"><Twitter size={16} /></button>
                <button className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-ink-secondary hover:bg-primary-500 hover:text-white transition-all"><Linkedin size={16} /></button>
                <button className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-ink-secondary hover:bg-primary-500 hover:text-white transition-all"><Facebook size={16} /></button>
              </div>
              <div className="flex-1 max-w-3xl" dangerouslySetInnerHTML={{ __html: article.content || '' }} />
            </div>
          </div>
        </section>

        {article.tags && article.tags.length > 0 && (
          <section className="pb-16 bg-surface-white">
            <div className="container-content">
              <div className="max-w-3xl mx-auto flex flex-wrap gap-3">
                {article.tags.map((tag) => (
                  <span key={tag} className="text-sm px-4 py-2 rounded-full bg-surface-section text-ink-secondary border border-gray-100">#{tag}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        {relatedArticles.length > 0 && (
          <section className="section-md bg-surface-section">
            <div className="container-content">
              <h2 className="text-2xl font-heading font-bold text-ink-primary mb-10">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedArticles.map((a) => (
                  <Link key={a._id} to={`/knowledge-hub/${a.slug}`} className="card-hover p-6">
                    <span className="text-xs font-semibold text-primary-500">{a.category}</span>
                    <h3 className="text-lg font-bold font-heading text-ink-primary mt-2 group-hover:text-primary-500 transition-colors line-clamp-2">{a.title}</h3>
                    <span className="text-sm text-ink-secondary mt-2 block">{formattedDate}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </PageLayout>
    </>
  );
}
