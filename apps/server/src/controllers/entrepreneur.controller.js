const Entrepreneur = require('../models/Entrepreneur');
const ActivityLog = require('../models/ActivityLog');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/paginate');

const logActivity = async (action, resource, resourceId, user, details) => {
  await ActivityLog.create({ action, resource, resourceId, user: user?._id, details });
};

const getAll = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.district) filter.district = req.query.district;
  if (req.query.sector) filter.sector = req.query.sector;

  const result = await paginate(Entrepreneur, filter, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
    search: req.query.search,
    searchFields: ['name', 'bio', 'district', 'sector'],
  });

  sendSuccess(res, result.data, 'Entrepreneurs fetched', 200, result.meta);
});

const getOne = catchAsync(async (req, res) => {
  const entrepreneur = await Entrepreneur.findById(req.params.id);
  if (!entrepreneur) return sendError(res, 'Entrepreneur not found', 404);
  sendSuccess(res, entrepreneur);
});

const create = catchAsync(async (req, res) => {
  const entrepreneur = await Entrepreneur.create(req.body);
  await logActivity('create', 'Entrepreneur', entrepreneur._id, req.user, `Created entrepreneur: ${entrepreneur.name}`);
  sendSuccess(res, entrepreneur, 'Entrepreneur created', 201);
});

const update = catchAsync(async (req, res) => {
  const entrepreneur = await Entrepreneur.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!entrepreneur) return sendError(res, 'Entrepreneur not found', 404);
  await logActivity('update', 'Entrepreneur', entrepreneur._id, req.user, `Updated entrepreneur: ${entrepreneur.name}`);
  sendSuccess(res, entrepreneur, 'Entrepreneur updated');
});

const deleteOne = catchAsync(async (req, res) => {
  const entrepreneur = await Entrepreneur.findByIdAndDelete(req.params.id);
  if (!entrepreneur) return sendError(res, 'Entrepreneur not found', 404);
  await logActivity('delete', 'Entrepreneur', entrepreneur._id, req.user, `Deleted entrepreneur: ${entrepreneur.name}`);
  sendSuccess(res, null, 'Entrepreneur deleted');
});

module.exports = { getAll, getOne, create, update, deleteOne };
