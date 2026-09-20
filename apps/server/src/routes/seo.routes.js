const express = require('express');
const Article = require('../models/Article');
const Recognition = require('../models/Recognition');
const env = require('../config/env');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

// Canonical site base (e.g. https://ravivarvichar.in or http://localhost:5173 in dev).
const siteUrl = () => String(env.CLIENT_URL || '').replace(/\/+$/, '');

const escapeXml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toIsoDate = (date) => {
  if (!date) return undefined;
  const d = new Date(date);
  if (isNaN(d.getTime()) || d.getFullYear() < 2000) return undefined;
  return d.toISOString().split('T')[0];
};

const getLatestDate = (d1, d2) => {
  const t1 = d1 ? new Date(d1).getTime() : 0;
  const t2 = d2 ? new Date(d2).getTime() : 0;
  const latest = Math.max(t1, t2);
  if (!latest || isNaN(latest)) return undefined;
  return toIsoDate(new Date(latest));
};

const toAbsoluteUrl = (url, base) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
};

// Static public pages (top-level client routes).
const STATIC_PAGES = [
  '',
  '/about',
  '/articles',
  '/interviews',
  '/media',
  '/gallery',
  '/events',
  '/contact',
  '/faq',
  '/get-featured',
  '/join-our-initiative',
  '/partner-with-us',
  '/recognitions',
];

const WHAT_WE_DO_SLUGS = [
  'women-entrepreneurship',
  'shgs',
  'financial-literacy',
  'leadership-skill-development',
];

// Percent-encode non-ASCII characters per sitemap spec
const buildUrl = (base, path) => encodeURI(`${base}${path}`);

// ═════════════════════════════════════════════════════════════════════════
//  MAIN SITEMAP — GET /sitemap.xml (Dynamic with Images & Priority Ordering)
// ═════════════════════════════════════════════════════════════════════════
router.get('/sitemap.xml', catchAsync(async (req, res) => {
  const base = siteUrl();
  if (!base) {
    return res.status(500).type('text/plain').send('CLIENT_URL is not configured');
  }

  // Articles first (ordered by freshest date)
  const articles = await Article.find({
    status: 'published',
    'seo.excludeFromSearch': { $ne: true },
    slug: { $ne: null },
  })
    .select('slug title thumbnail seo.ogImage publishedAt updatedAt')
    .sort({ publishedAt: -1, updatedAt: -1 })
    .lean();

  const recognitions = await Recognition.find({ slug: { $ne: null } })
    .select('slug title imageUrl updatedAt')
    .sort({ updatedAt: -1 })
    .lean();

  const articleUrls = articles
    .map((a) => {
      const lastmod = getLatestDate(a.updatedAt, a.publishedAt);
      const cleanSlug = String(a.slug || '').trim();
      const rawImg = a.thumbnail || a.seo?.ogImage;
      const imgUrl = rawImg ? toAbsoluteUrl(rawImg, base) : '';

      return (
        `  <url>\n` +
        `    <loc>${escapeXml(buildUrl(base, `/articles/${cleanSlug}`))}</loc>\n` +
        (lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : '') +
        (imgUrl
          ? `    <image:image>\n` +
            `      <image:loc>${escapeXml(imgUrl)}</image:loc>\n` +
            `      <image:title>${escapeXml(a.title || '')}</image:title>\n` +
            `    </image:image>\n`
          : '') +
        `  </url>`
      );
    })
    .join('\n');

  const recognitionUrls = recognitions
    .map((r) => {
      const lastmod = toIsoDate(r.updatedAt);
      const cleanSlug = String(r.slug || '').trim();
      const imgUrl = r.imageUrl ? toAbsoluteUrl(r.imageUrl, base) : '';
      return (
        `  <url>\n` +
        `    <loc>${escapeXml(buildUrl(base, `/recognitions/${cleanSlug}`))}</loc>\n` +
        (lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : '') +
        (imgUrl
          ? `    <image:image>\n` +
            `      <image:loc>${escapeXml(imgUrl)}</image:loc>\n` +
            `      <image:title>${escapeXml(r.title || '')}</image:title>\n` +
            `    </image:image>\n`
          : '') +
        `  </url>`
      );
    })
    .join('\n');

  const staticUrls = STATIC_PAGES
    .map((p) => `  <url>\n    <loc>${escapeXml(buildUrl(base, p === '' ? '/' : p))}</loc>\n  </url>`)
    .join('\n');

  const whatWeDoUrls = WHAT_WE_DO_SLUGS
    .map((slug) => `  <url>\n    <loc>${escapeXml(buildUrl(base, `/what-we-do/${slug}`))}</loc>\n  </url>`)
    .join('\n');

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    `${articleUrls}\n${recognitionUrls}\n${staticUrls}\n${whatWeDoUrls}\n` +
    `</urlset>\n`;

  // 10 minutes cache so newly published articles are visible to crawlers immediately
  res
    .status(200)
    .set('Content-Type', 'application/xml; charset=utf-8')
    .set('Cache-Control', 'public, max-age=600')
    .send(xml);
}));

// ═════════════════════════════════════════════════════════════════════════
//  GOOGLE NEWS SITEMAP — GET /news-sitemap.xml
//  Dedicated sitemap for Googlebot News (articles published in last 48 hours)
// ═════════════════════════════════════════════════════════════════════════
router.get('/news-sitemap.xml', catchAsync(async (req, res) => {
  const base = siteUrl();
  if (!base) {
    return res.status(500).type('text/plain').send('CLIENT_URL is not configured');
  }

  // Google News sitemaps accept articles from the last 2-3 days (48-72h)
  const cutoff = new Date(Date.now() - 72 * 60 * 60 * 1000);
  const recentArticles = await Article.find({
    status: 'published',
    'seo.excludeFromSearch': { $ne: true },
    slug: { $ne: null },
    publishedAt: { $gte: cutoff },
  })
    .select('slug title publishedAt')
    .sort({ publishedAt: -1 })
    .limit(100)
    .lean();

  const newsUrls = recentArticles
    .map((a) => {
      const cleanSlug = String(a.slug || '').trim();
      const pubDate = new Date(a.publishedAt).toISOString();
      return (
        `  <url>\n` +
        `    <loc>${escapeXml(buildUrl(base, `/articles/${cleanSlug}`))}</loc>\n` +
        `    <news:news>\n` +
        `      <news:publication>\n` +
        `        <news:name>Ravivar Vichar</news:name>\n` +
        `        <news:language>hi</news:language>\n` +
        `      </news:publication>\n` +
        `      <news:publication_date>${pubDate}</news:publication_date>\n` +
        `      <news:title>${escapeXml(a.title)}</news:title>\n` +
        `    </news:news>\n` +
        `  </url>`
      );
    })
    .join('\n');

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n` +
    `${newsUrls}\n` +
    `</urlset>\n`;

  res
    .status(200)
    .set('Content-Type', 'application/xml; charset=utf-8')
    .set('Cache-Control', 'public, max-age=600')
    .send(xml);
}));

// ═════════════════════════════════════════════════════════════════════════
//  RSS 2.0 FEED — GET /rss.xml or GET /feed.xml
//  Google officially recommends pairing sitemaps with RSS feeds for fast crawling
// ═════════════════════════════════════════════════════════════════════════
const handleRss = catchAsync(async (req, res) => {
  const base = siteUrl();
  if (!base) {
    return res.status(500).type('text/plain').send('CLIENT_URL is not configured');
  }

  const articles = await Article.find({
    status: 'published',
    'seo.excludeFromSearch': { $ne: true },
    slug: { $ne: null },
  })
    .select('slug title excerpt content publishedAt authorName')
    .sort({ publishedAt: -1 })
    .limit(30)
    .lean();

  const items = articles
    .map((a) => {
      const cleanSlug = String(a.slug || '').trim();
      const link = escapeXml(buildUrl(base, `/articles/${cleanSlug}`));
      const pubDate = a.publishedAt ? new Date(a.publishedAt).toUTCString() : new Date().toUTCString();
      const desc = escapeXml(a.excerpt || (a.content ? a.content.replace(/<[^>]*>/g, '').slice(0, 300) : ''));

      return (
        `    <item>\n` +
        `      <title>${escapeXml(a.title)}</title>\n` +
        `      <link>${link}</link>\n` +
        `      <guid isPermaLink="true">${link}</guid>\n` +
        `      <pubDate>${pubDate}</pubDate>\n` +
        `      <description>${desc}</description>\n` +
        (a.authorName ? `      <author>${escapeXml(a.authorName)}</author>\n` : '') +
        `    </item>`
      );
    })
    .join('\n');

  const rss =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
    `  <channel>\n` +
    `    <title>Ravivar Vichar</title>\n` +
    `    <link>${base}</link>\n` +
    `    <description>Empowering rural communities through research, entrepreneurship, and self-help groups.</description>\n` +
    `    <language>hi</language>\n` +
    `    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml" />\n` +
    `${items}\n` +
    `  </channel>\n` +
    `</rss>\n`;

  res
    .status(200)
    .set('Content-Type', 'application/xml; charset=utf-8')
    .set('Cache-Control', 'public, max-age=600')
    .send(rss);
});

router.get('/rss.xml', handleRss);
router.get('/feed.xml', handleRss);

// ═════════════════════════════════════════════════════════════════════════
//  ROBOTS.TXT — GET /robots.txt
// ═════════════════════════════════════════════════════════════════════════
router.get('/robots.txt', (req, res) => {
  const base = siteUrl();
  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    '# AI training / content-scraping crawlers',
    'User-agent: Amazonbot',
    'Disallow: /',
    'User-agent: Applebot-Extended',
    'Disallow: /',
    'User-agent: Bytespider',
    'Disallow: /',
    'User-agent: CCBot',
    'Disallow: /',
    'User-agent: ClaudeBot',
    'Disallow: /',
    'User-agent: GPTBot',
    'Disallow: /',
    'User-agent: Google-Extended',
    'Disallow: /',
    'User-agent: meta-externalagent',
    'Disallow: /',
    '',
    ...(base
      ? [
          `Sitemap: ${base}/sitemap.xml`,
          `Sitemap: ${base}/news-sitemap.xml`,
        ]
      : []),
    '',
  ].join('\n');

  res
    .status(200)
    .set('Content-Type', 'text/plain; charset=utf-8')
    .set('Cache-Control', 'public, max-age=600')
    .send(robots);
});

// Catch-all for any *-sitemap.xml requests that don't exist
router.get('/*sitemap*.xml', (req, res) => {
  res.status(404).type('text/plain').send('Not Found');
});

module.exports = router;
