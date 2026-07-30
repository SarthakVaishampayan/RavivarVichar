const Recognition = require('../models/Recognition');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/paginate');
const generateSlug = require('../utils/generateSlug');

// GET /api/v1/recognitions — public
const getAll = catchAsync(async (req, res) => {
  const result = await paginate(Recognition, {}, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort || '-date',
    search: req.query.search,
    searchFields: ['title', 'source', 'summary'],
  });
  sendSuccess(res, result.data, 'Recognitions fetched', 200, result.meta);
});

// GET /api/v1/recognitions/:id — public
const getOne = catchAsync(async (req, res) => {
  const recognition = await Recognition.findById(req.params.id);
  if (!recognition) return sendError(res, 'Recognition not found', 404);
  sendSuccess(res, recognition, 'Recognition fetched');
});

// GET /api/v1/recognitions/slug/:slug — public
const getBySlug = catchAsync(async (req, res) => {
  const recognition = await Recognition.findOne({ slug: req.params.slug });
  if (!recognition) return sendError(res, 'Recognition not found', 404);
  sendSuccess(res, recognition, 'Recognition fetched');
});

// POST /api/v1/recognitions — admin only
const create = catchAsync(async (req, res) => {
  const { title, source, url, summary, imageUrl, gallery, date } = req.body;
  if (!title || !source) {
    return sendError(res, 'Title and source are required', 400);
  }
  const data = { title, source, url, summary, imageUrl, gallery, date };
  if (title) {
    data.slug = generateSlug(title);
  }
  const recognition = await Recognition.create(data);
  sendSuccess(res, recognition, 'Recognition created', 201);
});

// PUT /api/v1/recognitions/:id — admin only
const update = catchAsync(async (req, res) => {
  const data = { ...req.body };
  if (data.title) {
    data.slug = generateSlug(data.title);
  }
  const recognition = await Recognition.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!recognition) return sendError(res, 'Recognition not found', 404);
  sendSuccess(res, recognition, 'Recognition updated');
});

// DELETE /api/v1/recognitions/:id — admin only
const deleteOne = catchAsync(async (req, res) => {
  const recognition = await Recognition.findByIdAndDelete(req.params.id);
  if (!recognition) return sendError(res, 'Recognition not found', 404);
  sendSuccess(res, null, 'Recognition removed');
});

module.exports = { getAll, getOne, getBySlug, create, update, deleteOne };
