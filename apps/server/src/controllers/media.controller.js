const MediaItem = require('../models/MediaItem');
const ActivityLog = require('../models/ActivityLog');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/paginate');

const logActivity = async (action, resource, resourceId, user, details) => {
  await ActivityLog.create({ action, resource, resourceId, user: user?._id, details });
};

const getAll = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;

  const result = await paginate(MediaItem, filter, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort || '-date',
    search: req.query.search,
    searchFields: ['title', 'description'],
  });

  sendSuccess(res, result.data, 'Media items fetched', 200, result.meta);
});

const getOne = catchAsync(async (req, res) => {
  const item = await MediaItem.findById(req.params.id);
  if (!item) return sendError(res, 'Media item not found', 404);
  sendSuccess(res, item);
});

const create = catchAsync(async (req, res) => {
  const item = await MediaItem.create(req.body);
  await logActivity('create', 'MediaItem', item._id, req.user, `Created media: ${item.title}`);
  sendSuccess(res, item, 'Media item created', 201);
});

const update = catchAsync(async (req, res) => {
  const item = await MediaItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return sendError(res, 'Media item not found', 404);
  await logActivity('update', 'MediaItem', item._id, req.user, `Updated media: ${item.title}`);
  sendSuccess(res, item, 'Media item updated');
});

const deleteOne = catchAsync(async (req, res) => {
  const item = await MediaItem.findByIdAndDelete(req.params.id);
  if (!item) return sendError(res, 'Media item not found', 404);
  await logActivity('delete', 'MediaItem', item._id, req.user, `Deleted media: ${item.title}`);
  sendSuccess(res, null, 'Media item deleted');
});

module.exports = { getAll, getOne, create, update, deleteOne };
