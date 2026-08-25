const express = require('express');
const Article = require('../models/Article');
const Recognition = require('../models/Recognition');
const env = require('../config/env');

const router = express.Router();

// ─── SEO Health Check ──────────────────────────────────────────────────
// GET /api/v1/seo/health
//
// Returns a JSON report of SEO health indicators.  Use this to monitor
// for issues like:
//   - Articles with missing slugs
//   - Articles in sitemap that shouldn't be
//   - Articles missing from sitemap
//   - Duplicate slugs
//   - Articles with noindex that should be indexable
//
// Auth required: this is an admin-only endpoint.
const { protect } = require('../middlewares/auth.middleware');

router.get('/health', protect, async (req, res) => {
  try {
    const base = String(env.CLIENT_URL || '').replace(/\/+$/, '');

    // ─── Article statistics ───
    const totalArticles = await Article.countDocuments();
    const publishedArticles = await Article.countDocuments({ status: 'published' });
    const draftArticles = await Article.countDocuments({ status: 'draft' });
    const excludedFromSearch = await Article.countDocuments({ 'seo.excludeFromSearch': true });

    // ─── Sitemap candidates ───
    const sitemapArticles = await Article.find({
      status: 'published',
      'seo.excludeFromSearch': { $ne: true },
      slug: { $ne: null },
    })
      .select('slug title seo.excludeFromSearch')
      .lean();

    // ─── Issues detection ───
    const issues = [];

    // Check for articles with null/empty slugs
    const noSlug = await Article.find({
      status: 'published',
      $or: [{ slug: null }, { slug: '' }],
    })
      .select('title')
      .lean();

    if (noSlug.length > 0) {
      issues.push({
        severity: 'high',
        message: `${noSlug.length} published article(s) have no slug`,
        articles: noSlug.map((a) => a.title),
      });
    }

    // Check for duplicate slugs
    const slugAgg = await Article.aggregate([
      { $match: { slug: { $ne: null } } },
      { $group: { _id: '$slug', count: { $sum: 1 }, ids: { $push: '$_id' } } },
      { $match: { count: { $gt: 1 } } },
    ]);

    if (slugAgg.length > 0) {
      issues.push({
        severity: 'high',
        message: `${slugAgg.length} duplicate slug(s) found`,
        slugs: slugAgg.map((s) => ({ slug: s._id, count: s.count })),
      });
    }

    // Check for published articles missing from sitemap
    const sitemapSlugs = new Set(sitemapArticles.map((a) => a.slug));
    const allPublished = await Article.find({
      status: 'published',
      slug: { $ne: null },
    })
      .select('slug title')
      .lean();

    const missingFromSitemap = allPublished.filter((a) => !sitemapSlugs.has(a.slug));
    if (missingFromSitemap.length > 0) {
      issues.push({
        severity: 'medium',
        message: `${missingFromSitemap.length} published article(s) missing from sitemap (likely excluded)`,
        articles: missingFromSitemap.map((a) => a.title),
      });
    }

    // Check for articles with excludeFromSearch that are published
    if (excludedFromSearch > 0) {
      issues.push({
        severity: 'info',
        message: `${excludedFromSearch} article(s) explicitly excluded from search`,
      });
    }

    // ─── Recognition statistics ───
    const totalRecognitions = await Recognition.countDocuments();
    const recognitionsWithSlug = await Recognition.countDocuments({ slug: { $ne: null } });

    // ─── Summary ───
    const hasHighIssues = issues.some((i) => i.severity === 'high');
    const hasMediumIssues = issues.some((i) => i.severity === 'medium');

    res.json({
      success: true,
      data: {
        status: hasHighIssues ? 'critical' : hasMediumIssues ? 'warning' : 'healthy',
        timestamp: new Date().toISOString(),
        stats: {
          articles: {
            total: totalArticles,
            published: publishedArticles,
            draft: draftArticles,
            excludedFromSearch,
            inSitemap: sitemapArticles.length,
          },
          recognitions: {
            total: totalRecognitions,
            withSlug: recognitionsWithSlug,
          },
        },
        issues,
        sitemapUrl: `${base}/sitemap.xml`,
        robotsUrl: `${base}/robots.txt`,
      },
    });
  } catch (err) {
    console.error('SEO health check error:', err);
    res.status(500).json({ success: false, message: 'SEO health check failed' });
  }
});

module.exports = router;
