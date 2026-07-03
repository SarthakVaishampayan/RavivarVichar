const Article = require('../models/Article');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/paginate');
const generateSlug = require('../utils/generateSlug');
const ActivityLog = require('../models/ActivityLog');

const logActivity = async (action, resource, resourceId, user, details) => {
  await ActivityLog.create({ action, resource, resourceId, user: user?._id, details });
};

// GET /api/v1/articles?page=&limit=&sort=&search=&status=&category=&featured=
const getAll = catchAsync(async (req, res) => {
  const { status, category, featured } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (featured) filter.featured = featured === 'true';
  // Public: only published. Admin: all statuses
  if (!req.user) filter.status = 'published';

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
  if (data.title && !data.slug) {
    data.slug = generateSlug(data.title);
  }
  const article = await Article.create(data);
  await logActivity('create', 'Article', article._id, req.user, `Created article: ${article.title}`);
  sendSuccess(res, article, 'Article created', 201);
});

// PUT /api/v1/articles/:id
const update = catchAsync(async (req, res) => {
  const data = { ...req.body };
  if (data.title) {
    data.slug = generateSlug(data.title);
  }
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
