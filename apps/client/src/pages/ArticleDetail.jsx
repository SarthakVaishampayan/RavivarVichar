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
  const [readingProgress, setReadingProgress] = useState(0);
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

  // Reading progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setReadingProgress(Math.min(100, Math.max(0, scrollPercent)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-gray-100">
        <div
          className="h-full bg-primary-500 transition-all duration-100 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <Helmet>
        <title>{article.title} — Ravivar Vichar</title>
        <meta name="description" content={(article.excerpt || article.content || '').replace(/<[^>]*>/g, '').slice(0, 160)} />
      </Helmet>

      <PageLayout>
        {/* Article Header */}
        <section className="bg-surface-white pt-24 pb-8 lg:pb-12">
          <div className="container-content">
            <div className="max-w-4xl mx-auto">
              <Link to="/knowledge-hub" className="inline-flex items-center gap-2 text-sm font-medium text-ink-secondary hover:text-primary-500 transition-colors mb-8">
                <ArrowLeft size={16} /> Back to Knowledge Hub
              </Link>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-heading font-bold text-ink-primary leading-tight">
                  {article.title}
                </h1>
                <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full bg-primary-50 text-primary-600 whitespace-nowrap">
                  {article.category}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-5 mt-4 text-sm text-ink-secondary">
                <span className="flex items-center gap-1.5"><User size={16} /> {authorName}</span>
                <span className="flex items-center gap-1.5"><Calendar size={16} /> {formattedDate}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-white pb-8">
          <div className="container-content">
            <div className="max-w-4xl mx-auto">
            {article.thumbnail && (
              <div className="rounded-xl overflow-hidden shadow-xl max-w-4xl mx-auto">
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
                    loading="lazy"
                    className="w-full h-40 object-cover rounded-lg shadow-sm"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ))}
              </div>
            )}
            </div>
          </div>
        </section>

        <section className="section-md bg-surface-white">
          <div className="container-content">
            <div className="flex gap-12 max-w-5xl mx-auto">
              <div className="hidden lg:flex flex-col items-center gap-4 pt-4 sticky top-[120px] h-fit">
                <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">Share</span>
                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener,noreferrer,width=600,height=400')}
                  className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-ink-secondary hover:bg-primary-500 hover:text-white transition-all"
                  title="Share on Twitter"
                ><Twitter size={16} /></button>
                <button
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener,noreferrer,width=600,height=400')}
                  className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-ink-secondary hover:bg-primary-500 hover:text-white transition-all"
                  title="Share on LinkedIn"
                ><Linkedin size={16} /></button>
                <button
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener,noreferrer,width=600,height=400')}
                  className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-ink-secondary hover:bg-primary-500 hover:text-white transition-all"
                  title="Share on Facebook"
                ><Facebook size={16} /></button>
              </div>
              <div className="article-content flex-1 max-w-3xl" dangerouslySetInnerHTML={{ __html: article.content || '' }} />
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
