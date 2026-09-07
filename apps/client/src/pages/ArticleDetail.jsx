import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/shared/Button';
import { ArrowLeft, Calendar, User, Linkedin, Twitter, Facebook, Link2, Check } from 'lucide-react';
import api from '../lib/axios';

// ─── WhatsApp brand icon ───
// lucide-react doesn't ship brand icons, so we inline the official WhatsApp
// glyph (simple-icons path) to match the Twitter/LinkedIn/Facebook buttons.
const WhatsAppIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ─── SHARE BUTTON (with hover tooltip) ───
// Wraps a round share icon with a label tooltip that fades in on hover so
// readers always know what each button does before clicking it.
const ShareButton = ({
  label,
  onClick,
  className = 'bg-gray-100 text-ink-secondary hover:bg-primary-500 hover:text-white',
  children,
}) => (
  <div className="relative group shrink-0">
    <button
      onClick={onClick}
      aria-label={label}
      className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${className}`}
    >
      {children}
    </button>
    {/* Tooltip is hover-only, so keep it on lg+ (the side rail) and hide it on
        touch screens where the bottom share bar is shown instead. */}
    <span className="hidden lg:block pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 text-white text-xs font-medium px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 shadow-lg">
      {label}
    </span>
  </div>
);

// Categories that belong to the "Articles" group (all other categories are their own group)
const ARTICLE_GROUP = ['General', 'Case Study', 'Explainer', 'News', 'Opinion', 'Impact Story', 'Policy Brief'];

const getCategoryGroup = (category) => {
  if (ARTICLE_GROUP.includes(category)) return ARTICLE_GROUP;
  return category ? [category] : ARTICLE_GROUP;
};

// ─── Media helpers: direct video/audio files vs embeddable (YouTube/Vimeo) URLs ───
const MEDIA_FILE_EXT = /\.(mp4|webm|ogg|mov|avi|mkv|mpeg|mpg|3gp|wmv|mp3|wav|m4a|flac|aac)(\?|#|$)/i;
const AUDIO_FILE_EXT = /\.(mp3|wav|m4a|flac|aac)(\?|#|$)/i;

// Social scrapers (Facebook, WhatsApp, Twitter) reject relative image URLs —
// turn /uploads/... into absolute URLs using the current origin.
const toAbsoluteUrl = (url) => {
  if (!url || !url.startsWith('/')) return url;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}${url}`;
};

const isMediaFile = (url) =>
  !!url && (MEDIA_FILE_EXT.test(url) || url.includes('/uploads/') || url.includes('cloudinary'));

const isAudioFile = (url) => !!url && AUDIO_FILE_EXT.test(url);

const getEmbedUrl = (url) => {
  if (!url) return url;
  if (url.includes('watch?v=')) return url.replace('watch?v=', 'embed/');
  if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
  if (url.includes('youtube.com/embed/')) return url;
  if (url.includes('vimeo.com/')) {
    const id = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (id) return `https://player.vimeo.com/video/${id[1]}`;
  }
  return url;
};

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await api.get(`/articles/slug/${slug}`);
        setArticle(data.data);
        // Fetch related articles from the SAME category group only
        // (e.g. a podcast only relates to other podcasts, an article only to articles)
        const group = getCategoryGroup(data.data?.category);
        const { data: related } = await api.get('/articles', { params: { status: 'published', limit: 20 } });
        setRelatedArticles((related.data || []).filter((a) => a.slug !== slug && group.includes(a.category)).slice(0, 3));
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
          <Button variant="primary" to="/articles" className="mt-8">Back to Articles</Button>
        </div>
      </PageLayout>
    );
  }

  // Prefer the manually-entered Author Name, then Credits, then the account that created it
  const authorName = article.authorName || article.credit || article.author?.name || 'Ravivar Vichar Team';
  const formattedDate = article.publishedAt || article.createdAt
    ? new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : '';

  // ─── SEO values ───
  const seo = article.seo || {};
  // Canonical = the clean public URL (no query string, no hash). If the CMS
  // has a custom canonical URL use it; otherwise self-reference the article.
  // Always use the non-www origin to stay consistent with the server-rendered
  // canonical (which uses CLIENT_URL = https://ravivarvichar.in).
  const canonicalUrl = (() => {
    if (seo.canonicalUrl) return seo.canonicalUrl;
    if (typeof window === 'undefined') return '';
    // Strip www. from the hostname so the canonical always points to
    // ravivarvichar.in (not www.ravivarvichar.in).
    const origin = window.location.origin.replace(/\/\/www\./, '//');
    return `${origin}${window.location.pathname}`;
  })();
  const plainContent = (article.content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const metaDescription = (seo.metaDescription || article.excerpt || plainContent).slice(0, 160);
  const ogImage = toAbsoluteUrl(seo.ogImage || article.thumbnail || '');
  const twitterImage = toAbsoluteUrl(seo.twitterImage || ogImage);
  // Plain 'Article' by default — NewsArticle is only correct for genuine news
  const schemaType = seo.schemaType || 'Article';

  // Sharing needs the DECODED canonical URL. window.location.href and
  // window.location.pathname are percent-encoded (Devanagari → %E0%A4...),
  // and putting the encoded form in the message makes WhatsApp show it as
  // plain text instead of generating a Rich Link Preview. Decoding restores
  // the clean Hindi URL; WhatsApp re-encodes it at the HTTP level when it
  // fetches the page for preview metadata. The same clean URL is what we
  // copy to the clipboard for pasting anywhere else.
  const shareUrl = (() => {
    const url = canonicalUrl || window.location.href;
    try {
      return decodeURIComponent(url);
    } catch {
      return url;
    }
  })();

  // Copy the clean article URL to the clipboard (with a legacy fallback for
  // browsers that don't support navigator.clipboard).
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    headline: article.title,
    description: metaDescription,
    ...(ogImage ? { image: [ogImage] } : {}),
    datePublished: article.publishedAt || article.createdAt || undefined,
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
    author: { '@type': 'Person', name: authorName },
    publisher: { '@type': 'Organization', name: 'Ravivar Vichar' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  };

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
        <title>{seo.metaTitle || article.title} — Ravivar Vichar</title>
        <meta name="description" content={metaDescription} />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        {seo.excludeFromSearch && <meta name="robots" content="noindex, nofollow" />}
        {seo.keywords?.length > 0 && <meta name="keywords" content={seo.keywords.join(', ')} />}
        {seo.metaNewsKeywords?.length > 0 && <meta name="news_keywords" content={seo.metaNewsKeywords.join(', ')} />}

        <meta property="og:type" content="article" />
        <meta property="og:title" content={seo.ogTitle || article.title} />
        <meta property="og:description" content={seo.ogDescription || metaDescription} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Ravivar Vichar" />

        <meta name="twitter:card" content={twitterImage ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:title" content={seo.twitterTitle || seo.ogTitle || article.title} />
        <meta name="twitter:description" content={seo.twitterDescription || seo.ogDescription || metaDescription} />
        {twitterImage && <meta name="twitter:image" content={twitterImage} />}

        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <PageLayout>
        {/* Article Header */}
        <section className="bg-surface-white pt-24 pb-8 lg:pb-12">
          <div className="container-content">
            <div className="max-w-4xl mx-auto">
              <Link to="/articles" className="inline-flex items-center gap-2 text-sm font-medium text-ink-secondary hover:text-primary-500 transition-colors mb-8">
                <ArrowLeft size={16} /> Back to Articles
              </Link>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-heading font-bold text-ink-primary leading-tight">
                  {article.title}
                </h1>
                <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full bg-primary-50 text-primary-600 whitespace-nowrap">
                  {article.category}
                </span>
              </div>
              {article.additionalCategories?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {article.additionalCategories.map((cat, i) => (
                    <span key={i} className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-surface-section text-ink-secondary border border-gray-100">
                      {cat}
                    </span>
                  ))}
                </div>
              )}
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

            {/* Banner Description — centered below image */}
            {article.bannerDescription && (
              <p className="text-lg text-ink-secondary italic leading-relaxed text-center mt-6">
                {article.bannerDescription}
              </p>
            )}

            {/* Credits — centered below banner description */}
            {article.credit && (
              <p className="text-[11px] text-ink-secondary italic text-center mt-2">
                {article.credit}
              </p>
            )}

            {article.videoUrl && (
              <div className="max-w-4xl mx-auto mt-8">
                {isMediaFile(article.videoUrl) ? (
                  isAudioFile(article.videoUrl) ? (
                    <div className="rounded-xl overflow-hidden shadow-lg bg-gray-900 p-6">
                      <audio src={article.videoUrl} controls className="w-full" />
                    </div>
                  ) : (
                    <div className="rounded-xl overflow-hidden shadow-lg bg-gray-900">
                      <video
                        src={article.videoUrl}
                        controls
                        preload="metadata"
                        className="w-full max-h-[500px]"
                        playsInline
                      />
                    </div>
                  )
                ) : (
                  <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      src={getEmbedUrl(article.videoUrl)}
                      title={article.title}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                )}
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
                <ShareButton
                  label="Share on Twitter"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener,noreferrer,width=600,height=400')}
                ><Twitter size={16} /></ShareButton>
                <ShareButton
                  label="Share on LinkedIn"
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener,noreferrer,width=600,height=400')}
                ><Linkedin size={16} /></ShareButton>
                <ShareButton
                  label="Share on Facebook"
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener,noreferrer,width=600,height=400')}
                ><Facebook size={16} /></ShareButton>
                {/* WhatsApp — message contains ONLY the clean (decoded) article
                    URL so WhatsApp fetches it and renders the Rich Link Preview
                    card (image, Hindi title, description, domain) from the
                    page's server-rendered Open Graph tags. */}
                <ShareButton
                  label="Share via WhatsApp"
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer,width=600,height=400')}
                ><WhatsAppIcon size={16} /></ShareButton>
                {/* Copy link — puts the clean article URL on the clipboard */}
                <ShareButton
                  label={copied ? 'Copied!' : 'Copy article link'}
                  onClick={handleCopyLink}
                  className={copied ? 'bg-green-500 text-white' : 'bg-gray-100 text-ink-secondary hover:bg-primary-500 hover:text-white'}
                >{copied ? <Check size={16} /> : <Link2 size={16} />}</ShareButton>
              </div>
              <div className="article-content flex-1 max-w-3xl" dangerouslySetInnerHTML={{ __html: article.content || '' }} />
            </div>
          </div>
        </section>

        {/* Mobile/tablet share row — simple and always visible right at the
            bottom of the article body (desktop keeps the sticky side rail). */}
        <section className="lg:hidden bg-surface-white pb-16">
          <div className="container-content">
            <div className="max-w-3xl mx-auto pt-8 border-t border-gray-100 flex items-center justify-center gap-3 flex-wrap">
              <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mr-1">Share</span>
              <ShareButton
                label="Share on Twitter"
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener,noreferrer,width=600,height=400')}
              ><Twitter size={18} /></ShareButton>
              <ShareButton
                label="Share on LinkedIn"
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener,noreferrer,width=600,height=400')}
              ><Linkedin size={18} /></ShareButton>
              <ShareButton
                label="Share on Facebook"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener,noreferrer,width=600,height=400')}
              ><Facebook size={18} /></ShareButton>
              <ShareButton
                label="Share via WhatsApp"
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer,width=600,height=400')}
              ><WhatsAppIcon size={18} /></ShareButton>
              <ShareButton
                label={copied ? 'Copied!' : 'Copy article link'}
                onClick={handleCopyLink}
                className={copied ? 'bg-green-500 text-white' : 'bg-gray-100 text-ink-secondary hover:bg-primary-500 hover:text-white'}
              >{copied ? <Check size={18} /> : <Link2 size={18} />}</ShareButton>
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
                  <Link key={a._id} to={`/articles/${a.slug}`} className="card-hover p-6">
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
