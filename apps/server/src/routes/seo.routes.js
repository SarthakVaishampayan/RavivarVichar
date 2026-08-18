const express = require('express');
const Article = require('../models/Article');
const Recognition = require('../models/Recognition');
const env = require('../config/env');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

// Canonical site base (e.g. https://ravivarvichar.in or http://localhost:5173 in dev).
// Used for every absolute URL in the sitemap so Google always sees the real domain.
const siteUrl = () => String(env.CLIENT_URL || '').replace(/\/+$/, '');

const escapeXml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toIsoDate = (date) => (date ? new Date(date).toISOString().split('T')[0] : undefined);

// Static public pages (top-level client routes). These are fixed, so they can
// live here — article/recognition URLs below are generated from the database.
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

// What We Do pages are hardcoded content in the client (no DB), so they are
// listed here exactly as they exist in apps/client/src/pages/WhatWeDoDetail.jsx.
const WHAT_WE_DO_SLUGS = [
  'women-entrepreneurship',
  'shgs',
  'financial-literacy',
  'leadership-skill-development',
];

// Percent-encode non-ASCII characters (e.g. Devanagari slugs) so the URLs
// are valid per the sitemap spec — Google can reject raw UTF-8 in <loc>.
const buildUrl = (base, path) => encodeURI(`${base}${path}`);

// Sitemap is built from the DB on every request. At this site's scale that is
// cheap, and it guarantees a freshly-published article appears immediately.
// Cache-Control lets Cloudflare/nginx serve it for an hour without re-hitting us.
router.get('/sitemap.xml', catchAsync(async (req, res) => {
  const base = siteUrl();
  if (!base) {
    return res.status(500).type('text/plain').send('CLIENT_URL is not configured');
  }

  // Published articles only, never drafts, never pages explicitly excluded from
  // search. This covers every content type on the site — articles, success
  // stories, research, interviews, podcasts, etc. are all Articles with a
  // category, and all share the /articles/:slug URL.
  const articles = await Article.find({
    status: 'published',
    'seo.excludeFromSearch': { $ne: true },
    slug: { $ne: null },
  })
    .select('slug title publishedAt updatedAt')
    .sort({ publishedAt: -1, updatedAt: -1 })
    .lean();

  // Every recognition (media coverage) has its own public page at /recognitions/:slug.
  const recognitions = await Recognition.find({ slug: { $ne: null } })
    .select('slug updatedAt')
    .sort({ updatedAt: -1 })
    .lean();

  const staticUrls = STATIC_PAGES
    .map((p) => `  <url>\n    <loc>${escapeXml(buildUrl(base, p === '' ? '/' : p))}</loc>\n  </url>`)
    .join('\n');

  const whatWeDoUrls = WHAT_WE_DO_SLUGS
    .map((slug) => `  <url>\n    <loc>${escapeXml(buildUrl(base, `/what-we-do/${slug}`))}</loc>\n  </url>`)
    .join('\n');

  const articleUrls = articles
    .map((a) => {
      const lastmod = toIsoDate(a.publishedAt || a.updatedAt);
      return (
        `  <url>\n` +
        `    <loc>${escapeXml(buildUrl(base, `/articles/${a.slug}`))}</loc>\n` +
        (lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : '') +
        `  </url>`
      );
    })
    .join('\n');

  const recognitionUrls = recognitions
    .map((r) => {
      const lastmod = toIsoDate(r.updatedAt);
      return (
        `  <url>\n` +
        `    <loc>${escapeXml(buildUrl(base, `/recognitions/${r.slug}`))}</loc>\n` +
        (lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : '') +
        `  </url>`
      );
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${staticUrls}\n${whatWeDoUrls}\n${articleUrls}\n${recognitionUrls}\n` +
    `</urlset>\n`;

  res
    .status(200)
    .set('Content-Type', 'application/xml; charset=utf-8')
    .set('Cache-Control', 'public, max-age=3600')
    .send(xml);
}));

// Standard robots.txt. The AI-crawler disallows below mirror the Cloudflare
// managed rules — harmless duplication while that's enabled, and still
// protective if the user ever turns Cloudflare's managed robots off.
// Crucially: Googlebot is NOT blocked, and the Sitemap line is present.
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
    ...(base ? [`Sitemap: ${base}/sitemap.xml`] : []),
    '',
  ].join('\n');

  res
    .status(200)
    .set('Content-Type', 'text/plain; charset=utf-8')
    .set('Cache-Control', 'public, max-age=3600')
    .send(robots);
});

module.exports = router;
