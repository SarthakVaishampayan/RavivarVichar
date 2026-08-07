const Article = require('../models/Article');
const sanitizeHtml = require('sanitize-html');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/paginate');
const generateSlug = require('../utils/generateSlug');
const { isAuthenticated } = require('../utils/optionalAuth');
const ActivityLog = require('../models/ActivityLog');

const logActivity = async (action, resource, resourceId, user, details) => {
  await ActivityLog.create({ action, resource, resourceId, user: user?._id, details });
};

// ─── Slug helpers ───
// Auto-generate a slug from the title ONLY when the caller didn't provide one.
// This keeps manually-edited permalinks (e.g. for Hindi articles) intact.
const resolveSlug = (data) => {
  if (data.title && !data.slug) {
    data.slug = generateSlug(data.title) || `article-${Date.now()}`;
  }
  return data;
};

// Append -2, -3, ... to a slug until it's unique (avoids Mongo E11000 crashes).
const ensureUniqueSlug = async (slug, excludeId) => {
  if (!slug) return slug;
  let candidate = slug;
  let i = 2;
  while (i < 100) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Article.findOne(query).select('_id');
    if (!existing) return candidate;
    candidate = `${slug}-${i++}`;
  }
  return `${slug}-${Date.now()}`;
};

// ─── HTML sanitization (prevents stored XSS) ───
const sanitizeArticleHtml = (html = '') =>
  sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      'h1', 'h2', 'h3', 'h4', 'h5', 'img', 'iframe', 'figure', 'figcaption', 'span',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'pre', 'video', 'source', 'br',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      iframe: ['src', 'title', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder'],
      video: ['src', 'controls', 'poster', 'width', 'height'],
      source: ['src', 'type'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
      '*': ['class', 'style'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    allowProtocolRelative: false,
    // Strip script/object/embed anything executable
    disallowedTagsMode: 'discard',
    // Only allow embeds from known video platforms — arbitrary iframes are a phishing/XSS vector
    transformTags: {
      iframe: (tagName, attribs) => {
        const src = attribs.src || '';
        const ok =
          /^(https?:)?\/\/(www\.)?(youtube\.com|youtu\.be|youtube-nocookie\.com|player\.vimeo\.com)\//.test(src) ||
          /^(https?:)?\/\/www\.youtube\.com\/embed\//.test(src);
        if (ok) {
          return { tagName, attribs: { src, title: attribs.title || '', width: attribs.width || '', height: attribs.height || '', allowfullscreen: '' } };
        }
        return {};
      },
    },
  });

const sanitizePlainText = (text = '') => sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });

// GET /api/v1/articles?page=&limit=&sort=&search=&status=&category=&featured=
// category supports comma-separated values, e.g. ?category=General,News,Opinion
const getAll = catchAsync(async (req, res) => {
  const { status, category, featured } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (category) {
    const categories = category.split(',').map((c) => c.trim()).filter(Boolean);
    if (categories.length === 1) filter.category = categories[0];
    else if (categories.length > 1) filter.category = { $in: categories };
  }
  if (featured) filter.featured = featured === 'true';
  // Public: only published. Authenticated admin: all statuses
  if (!(await isAuthenticated(req))) filter.status = 'published';

  const result = await paginate(Article, filter, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
    search: req.query.search,
    searchFields: ['title', 'excerpt', 'tags'],
  });

  sendSuccess(res, result.data, 'Articles fetched', 200, result.meta);
});

// GET /api/v1/articles/:id
const getOne = catchAsync(async (req, res) => {
  const article = await Article.findById(req.params.id).populate('author', 'name email');
  if (!article) return sendError(res, 'Article not found', 404);
  sendSuccess(res, article);
});

// GET /api/v1/articles/slug/:slug
const getBySlug = catchAsync(async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug }).populate('author', 'name email');
  if (!article) return sendError(res, 'Article not found', 404);
  // Increment views
  article.views = (article.views || 0) + 1;
  await article.save();
  sendSuccess(res, article);
});

// POST /api/v1/articles
const create = catchAsync(async (req, res) => {
  const data = { ...req.body, author: req.user._id };
  // Respect a manually-provided slug; otherwise auto-generate from the title
  resolveSlug(data);
  if (data.slug) data.slug = await ensureUniqueSlug(data.slug);
  // Sanitize rich-text fields before they reach the database
  if (data.content) data.content = sanitizeArticleHtml(data.content);
  if (data.excerpt) data.excerpt = sanitizePlainText(data.excerpt);
  if (data.title) data.title = sanitizePlainText(data.title);
  const article = await Article.create(data);
  await logActivity('create', 'Article', article._id, req.user, `Created article: ${article.title}`);
  sendSuccess(res, article, 'Article created', 201);
});

// PUT /api/v1/articles/:id
const update = catchAsync(async (req, res) => {
  const data = { ...req.body };
  // Respect a manually-provided slug; only regenerate when no slug is sent.
  // This is what keeps custom permalinks (e.g. Hindi titles) stable on edit.
  resolveSlug(data);
  if (data.slug) data.slug = await ensureUniqueSlug(data.slug, req.params.id);
  // Sanitize rich-text fields before they reach the database
  if (data.content) data.content = sanitizeArticleHtml(data.content);
  if (data.excerpt) data.excerpt = sanitizePlainText(data.excerpt);
  if (data.title) data.title = sanitizePlainText(data.title);
  const article = await Article.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!article) return sendError(res, 'Article not found', 404);
  await logActivity('update', 'Article', article._id, req.user, `Updated article: ${article.title}`);
  sendSuccess(res, article, 'Article updated');
});

// DELETE /api/v1/articles/:id
const deleteOne = catchAsync(async (req, res) => {
  const article = await Article.findByIdAndDelete(req.params.id);
  if (!article) return sendError(res, 'Article not found', 404);
  await logActivity('delete', 'Article', article._id, req.user, `Deleted article: ${article.title}`);
  sendSuccess(res, null, 'Article deleted');
});

module.exports = { getAll, getOne, getBySlug, create, update, deleteOne };
