const express = require('express');
const path = require('path');
const fs = require('fs');
const Article = require('../models/Article');
const Recognition = require('../models/Recognition');
const env = require('../config/env');

const router = express.Router();

// ─── SPA template cache ────────────────────────────────────────────────
// Read the built client index.html once at startup and serve it for every
// article/ recognition request with injected SEO metadata.  The SPA still
// loads and hydrates on top, but crawlers see the correct metadata in the
// very first HTML response.
const distPath = path.resolve(__dirname, '../../../client/dist/index.html');
let indexTemplate = null;

try {
  indexTemplate = fs.readFileSync(distPath, 'utf-8');
  console.log('✅ Article page renderer: loaded client index.html template');
} catch (err) {
  // In development the dist folder may not exist yet — that's fine, we'll
  // fall back to a minimal HTML page.
  console.warn('⚠️  Article page renderer: could not read client dist/index.html —', err.message);
}

// ─── Helpers ───────────────────────────────────────────────────────────
const siteUrl = () => String(env.CLIENT_URL || '').replace(/\/+$/, '');

const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const formatDate = (date) => {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

// ─── Build <head> meta tags for an article ─────────────────────────────
const buildArticleHeadTags = (article, canonicalUrl) => {
  const seo = article.seo || {};
  const base = siteUrl();
  const title = seo.metaTitle || `${article.title} — Ravivar Vichar`;
  const description = (seo.metaDescription || article.excerpt || '').slice(0, 160);
  const ogImage = seo.ogImage || article.thumbnail || '';
  const authorName =
    article.authorName || article.credit || article.author?.name || 'Ravivar Vichar Team';
  const schemaType = seo.schemaType || 'Article';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    headline: article.title,
    description,
    ...(ogImage ? { image: [ogImage] } : {}),
    datePublished: article.publishedAt || article.createdAt || undefined,
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
    author: { '@type': 'Person', name: authorName },
    publisher: { '@type': 'Organization', name: 'Ravivar Vichar' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  };

  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}">`,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">`,
    seo.excludeFromSearch
      ? '<meta name="robots" content="noindex, nofollow">'
      : '<meta name="robots" content="index, follow">',
    // Open Graph
    '<meta property="og:type" content="article">',
    `<meta property="og:title" content="${escapeHtml(seo.ogTitle || article.title)}">`,
    `<meta property="og:description" content="${escapeHtml(seo.ogDescription || description)}">`,
    ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}">` : null,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}">`,
    '<meta property="og:site_name" content="Ravivar Vichar">',
    // Twitter Card
    `<meta name="twitter:card" content="${ogImage ? 'summary_large_image' : 'summary'}">`,
    `<meta name="twitter:title" content="${escapeHtml(seo.twitterTitle || seo.ogTitle || article.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(seo.twitterDescription || seo.ogDescription || description)}">`,
    ogImage
      ? `<meta name="twitter:image" content="${escapeHtml(seo.twitterImage || ogImage)}">`
      : null,
    // JSON-LD structured data
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ].filter(Boolean);

  return tags.join('\n    ');
};

// ─── Inject SEO tags into the SPA template ─────────────────────────────
const renderWithTemplate = (headTags) => {
  if (!indexTemplate) return null;

  let html = indexTemplate;

  // 1. Replace the default <title> tag
  html = html.replace(/<title>[^<]*<\/title>/, '');

  // 2. Replace the default meta description (if present)
  html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, '');

  // 3. Replace the default og:title (if present)
  html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, '');

  // 4. Insert all article-specific tags right before </head>
  html = html.replace('</head>', `    ${headTags}\n  </head>`);

  return html;
};

// ─── Minimal fallback HTML (when SPA template isn't available) ─────────
const renderMinimal = (article, canonicalUrl, headTags) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${headTags}
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" sizes="any">
  <link rel="icon" type="image/png" href="/logo.png" sizes="192x192">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; color: #1a1a1a; }
    img { max-width: 100%; height: auto; border-radius: 12px; }
    .meta { color: #666; font-size: 0.9rem; margin-bottom: 1rem; }
    .content { line-height: 1.8; font-size: 1.1rem; }
    a { color: #2563eb; }
  </style>
</head>
<body>
  <article>
    <p class="meta">
      ${article.category ? `<span>${escapeHtml(article.category)}</span> · ` : ''}
      ${article.authorName || article.credit || 'Ravivar Vichar Team'}
      ${formatDate(article.publishedAt || article.createdAt) ? ` · ${formatDate(article.publishedAt || article.createdAt)}` : ''}
    </p>
    <h1>${escapeHtml(article.title)}</h1>
    ${article.thumbnail ? `<img src="${escapeHtml(article.thumbnail)}" alt="${escapeHtml(article.title)}" />` : ''}
    ${article.bannerDescription ? `<p><em>${escapeHtml(article.bannerDescription)}</em></p>` : ''}
    <div class="content">${article.content || ''}</div>
    ${article.tags && article.tags.length ? `<p style="margin-top:2rem;color:#888;font-size:0.85rem;">${article.tags.map((t) => `#${escapeHtml(t)}`).join(' ')}</p>` : ''}
  </article>
  <p style="margin-top:3rem;padding-top:1rem;border-top:1px solid #eee;font-size:0.85rem;">
    <a href="/">← Back to Ravivar Vichar</a>
  </p>
</body>
</html>`;

// ─── 404 page ──────────────────────────────────────────────────────────
const notFoundPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 — Article Not Found | Ravivar Vichar</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" sizes="any">
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:5rem auto;padding:2rem;text-align:center;color:#333;">
  <h1 style="font-size:4rem;margin:0;color:#ddd;">404</h1>
  <h2>Article Not Found</h2>
  <p>The article you're looking for doesn't exist or has been removed.</p>
  <p style="margin-top:2rem;"><a href="/" style="color:#2563eb;">← Go to Homepage</a></p>
</body>
</html>`;

// ═════════════════════════════════════════════════════════════════════════
//  ARTICLE DETAIL — GET /articles/:slug
// ═════════════════════════════════════════════════════════════════════════
router.get('/articles/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      status: 'published',
    }).populate('author', 'name');

    if (!article) {
      return res.status(404).type('html').send(notFoundPage);
    }

    const base = siteUrl();
    const canonicalUrl =
      article.seo?.canonicalUrl || `${base}/articles/${article.slug}`;

    const headTags = buildArticleHeadTags(article, canonicalUrl);

    // Try injecting into the SPA template first (preserves the full styled UI)
    const html = renderWithTemplate(headTags);
    if (html) {
      return res.status(200).type('html').send(html);
    }

    // Fallback: minimal server-rendered page (still has all SEO metadata)
    return res
      .status(200)
      .type('html')
      .send(renderMinimal(article, canonicalUrl, headTags));
  } catch (err) {
    console.error('Article page render error:', err);
    res.status(500).type('html').send('<h1>Internal Server Error</h1>');
  }
});

// ═════════════════════════════════════════════════════════════════════════
//  RECOGNITION DETAIL — GET /recognitions/:slug
// ═════════════════════════════════════════════════════════════════════════
router.get('/recognitions/:slug', async (req, res) => {
  try {
    const recognition = await Recognition.findOne({ slug: req.params.slug });

    if (!recognition) {
      return res.status(404).type('html').send(notFoundPage);
    }

    const base = siteUrl();
    const canonicalUrl = `${base}/recognitions/${recognition.slug}`;
    const title = `${recognition.title} — Recognitions — Ravivar Vichar`;
    const description = (recognition.summary || `Recognition from ${recognition.source}`).slice(0, 160);
    const ogImage = recognition.imageUrl || '';

    const tags = [
      `<title>${escapeHtml(title)}</title>`,
      `<meta name="description" content="${escapeHtml(description)}">`,
      `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">`,
      '<meta name="robots" content="index, follow">',
      '<meta property="og:type" content="article">',
      `<meta property="og:title" content="${escapeHtml(recognition.title)}">`,
      `<meta property="og:description" content="${escapeHtml(description)}">`,
      ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}">` : null,
      `<meta property="og:url" content="${escapeHtml(canonicalUrl)}">`,
      '<meta property="og:site_name" content="Ravivar Vichar">',
      `<meta name="twitter:card" content="${ogImage ? 'summary_large_image' : 'summary'}">`,
      `<meta name="twitter:title" content="${escapeHtml(recognition.title)}">`,
      `<meta name="twitter:description" content="${escapeHtml(description)}">`,
      ogImage ? `<meta name="twitter:image" content="${escapeHtml(ogImage)}">` : null,
      `<script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: recognition.title,
        description,
        datePublished: recognition.date,
        author: { '@type': 'Organization', name: recognition.source },
        publisher: { '@type': 'Organization', name: 'Ravivar Vichar' },
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        ...(ogImage ? { image: [ogImage] } : {}),
      })}</script>`,
    ].filter(Boolean).join('\n    ');

    const html = renderWithTemplate(tags);
    if (html) {
      return res.status(200).type('html').send(html);
    }

    // Fallback minimal page
    return res.status(200).type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${tags}
</head>
<body>
  <article>
    <h1>${escapeHtml(recognition.title)}</h1>
    <p>${escapeHtml(recognition.source)}${recognition.date ? ` · ${formatDate(recognition.date)}` : ''}</p>
    ${ogImage ? `<img src="${escapeHtml(ogImage)}" alt="${escapeHtml(recognition.title)}" style="max-width:100%;border-radius:12px;">` : ''}
    ${recognition.summary ? `<p>${escapeHtml(recognition.summary)}</p>` : ''}
  </article>
  <p><a href="/recognitions">← Back to Recognitions</a></p>
</body>
</html>`);
  } catch (err) {
    console.error('Recognition page render error:', err);
    res.status(500).type('html').send('<h1>Internal Server Error</h1>');
  }
});

module.exports = router;
