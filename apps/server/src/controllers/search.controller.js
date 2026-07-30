const Article = require('../models/Article');
const Recognition = require('../models/Recognition');
const GalleryImage = require('../models/GalleryImage');
const Event = require('../models/Event');
const { sendSuccess } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

// GET /api/v1/search?q=keyword
const globalSearch = catchAsync(async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) {
    return sendSuccess(res, { results: [] });
  }

  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 10));

  // Run searches in parallel
  const [articles, recognitions, gallery, events] = await Promise.all([
    Article.find({
      status: 'published',
      $or: [
        { title: regex },
        { excerpt: regex },
        { content: regex },
        { tags: regex },
        { category: regex },
        { 'seo.metaTitle': regex },
        { 'seo.metaDescription': regex },
      ],
    })
      .select('title slug excerpt content category thumbnail publishedAt')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean(),

    Recognition.find({
      $or: [
        { title: regex },
        { source: regex },
        { summary: regex },
      ],
    })
      .select('title slug source summary url imageUrl')
      .sort({ date: -1 })
      .limit(limit)
      .lean(),

    GalleryImage.find({
      $or: [
        { title: regex },
        { caption: regex },
        { summary: regex },
        { altText: regex },
      ],
    })
      .select('title caption summary imageUrl slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),

    Event.find({
      $or: [
        { title: regex },
        { description: regex },
        { 'location.address': regex },
      ],
    })
      .select('title type description location gallery')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),
  ]);

  // Helper to extract a snippet around the match
  const getSnippet = (text, query, maxLen = 150) => {
    if (!text) return '';
    const lower = text.toLowerCase();
    const idx = lower.indexOf(query.toLowerCase());
    if (idx === -1) return text.slice(0, maxLen) + (text.length > maxLen ? '...' : '');
    const start = Math.max(0, idx - 60);
    const end = Math.min(text.length, idx + query.length + 60);
    let snippet = text.slice(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet += '...';
    return snippet;
  };

  // Format results into a unified list
  const results = [];

  articles.forEach((a) => {
    const matchContent = a.content || '';
    results.push({
      _id: a._id,
      type: 'article',
      typeLabel: 'Article',
      title: a.title,
      slug: a.slug,
      url: `/articles/${a.slug}`,
      image: a.thumbnail || null,
      snippet: getSnippet(a.excerpt || matchContent, q),
      date: a.publishedAt,
    });
  });

  recognitions.forEach((r) => {
    results.push({
      _id: r._id,
      type: 'recognition',
      typeLabel: 'Recognition',
      title: r.title,
      slug: r.slug,
      url: `/recognitions/${r.slug}`,
      image: r.imageUrl || null,
      snippet: getSnippet(r.summary || r.source, q),
      date: r.date,
    });
  });

  gallery.forEach((g) => {
    results.push({
      _id: g._id,
      type: 'gallery',
      typeLabel: 'Gallery',
      title: g.title || g.caption || 'Gallery Image',
      slug: null,
      url: '/gallery',
      image: g.imageUrl || null,
      snippet: getSnippet(g.summary || g.caption, q),
      date: null,
    });
  });

  events.forEach((e) => {
    results.push({
      _id: e._id,
      type: 'event',
      typeLabel: 'Event',
      title: e.title,
      slug: null,
      url: '/events',
      image: (e.gallery && e.gallery[0]) || null,
      snippet: getSnippet(e.description || e.location?.address, q),
      date: null,
    });
  });

  // Sort by relevance: title matches first, then excerpt/content matches
  results.sort((a, b) => {
    const aTitle = a.title.toLowerCase().includes(q.toLowerCase()) ? 0 : 1;
    const bTitle = b.title.toLowerCase().includes(q.toLowerCase()) ? 0 : 1;
    if (aTitle !== bTitle) return aTitle - bTitle;
    return 0;
  });

  sendSuccess(res, { results, total: results.length, query: q });
});

module.exports = { globalSearch };
