const MediaMention = require('../models/MediaMention');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/paginate');

// GET /api/v1/media-mentions — public
const getAll = catchAsync(async (req, res) => {
  const result = await paginate(MediaMention, {}, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort || '-date',
    search: req.query.search,
    searchFields: ['title', 'source', 'summary'],
  });
  sendSuccess(res, result.data, 'Media mentions fetched', 200, result.meta);
});

// GET /api/v1/media-mentions/:id — public
const getOne = catchAsync(async (req, res) => {
  const mention = await MediaMention.findById(req.params.id);
  if (!mention) return sendError(res, 'Media mention not found', 404);
  sendSuccess(res, mention, 'Media mention fetched');
});

// POST /api/v1/media-mentions — admin only
const create = catchAsync(async (req, res) => {
  const { title, source, url, summary, imageUrl, date } = req.body;
  if (!title || !source || !url) {
    return sendError(res, 'Title, source, and URL are required', 400);
  }
  const mention = await MediaMention.create({ title, source, url, summary, imageUrl, date });
  sendSuccess(res, mention, 'Media mention created', 201);
});

// PUT /api/v1/media-mentions/:id — admin only
const update = catchAsync(async (req, res) => {
  const mention = await MediaMention.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!mention) return sendError(res, 'Media mention not found', 404);
  sendSuccess(res, mention, 'Media mention updated');
});

// DELETE /api/v1/media-mentions/:id — admin only
const deleteOne = catchAsync(async (req, res) => {
  const mention = await MediaMention.findByIdAndDelete(req.params.id);
  if (!mention) return sendError(res, 'Media mention not found', 404);
  sendSuccess(res, null, 'Media mention removed');
});

module.exports = { getAll, getOne, create, update, deleteOne };
