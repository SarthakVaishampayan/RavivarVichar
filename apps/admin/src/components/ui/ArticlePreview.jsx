import { useEffect } from 'react';
import { X, User, Calendar, Camera } from 'lucide-react';

// Full-page article preview mirroring the public ArticleDetail layout so authors
// see exactly how the article will look before publishing. Body typography is
// provided by the .article-preview-content styles in index.css (same rules as
// the public site's .article-content).
export default function ArticlePreview({ article = {}, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const authorName = article.authorName || article.credit || 'Ravivar Vichar Team';
  const formattedDate = article.publishedAt || article.createdAt
    ? new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : '';

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center pt-10 pb-8 px-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <h3 className="text-lg font-semibold text-gray-800">Article Preview</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">This is how readers will see the article</span>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 py-8 lg:px-12">
          {/* Title + category */}
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl lg:text-4xl font-heading font-bold text-ink-primary leading-tight">
              {article.title || 'Untitled Article'}
            </h1>
            {article.category && (
              <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full bg-primary-50 text-primary-600 whitespace-nowrap">
                {article.category}
              </span>
            )}
          </div>

          {article.additionalCategories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {article.additionalCategories.map((cat, i) => (
                <span key={i} className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-ink-secondary border border-gray-100">
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5 mt-4 text-sm text-ink-secondary">
            <span className="flex items-center gap-1.5"><User size={16} /> {authorName}</span>
            <span className="flex items-center gap-1.5"><Calendar size={16} /> {formattedDate || 'Not published yet'}</span>
            {article.credit && <span className="flex items-center gap-1.5"><Camera size={16} /> {article.credit}</span>}
          </div>

          {article.bannerDescription && (
            <p className="text-lg text-ink-secondary italic leading-relaxed border-l-4 border-primary-500 pl-5 mt-6">
              {article.bannerDescription}
            </p>
          )}

          {article.thumbnail && (
            <img
              src={article.thumbnail}
              alt={article.title || 'Featured image'}
              className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-xl mt-6"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}

          {/* Body */}
          <div className="article-preview-content mt-8" dangerouslySetInnerHTML={{ __html: article.content || '' }} />

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-10">
              {article.tags.map((tag) => (
                <span key={tag} className="text-sm px-4 py-2 rounded-full bg-gray-100 text-ink-secondary border border-gray-100">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
