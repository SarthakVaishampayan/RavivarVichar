const Partner = require('../models/Partner');
const ActivityLog = require('../models/ActivityLog');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/paginate');

const logActivity = async (action, resource, resourceId, user, details) => {
  await ActivityLog.create({ action, resource, resourceId, user: user?._id, details });
};

const getAll = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.status) filter.status = req.query.status;

  const result = await paginate(Partner, filter, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
    search: req.query.search,
    searchFields: ['name', 'description'],
  });

  sendSuccess(res, result.data, 'Partners fetched', 200, result.meta);
});

const getOne = catchAsync(async (req, res) => {
  const partner = await Partner.findById(req.params.id);
  if (!partner) return sendError(res, 'Partner not found', 404);
  sendSuccess(res, partner);
});

const create = catchAsync(async (req, res) => {
  const partner = await Partner.create(req.body);
  await logActivity('create', 'Partner', partner._id, req.user, `Created partner: ${partner.name}`);
  sendSuccess(res, partner, 'Partner created', 201);
});

const update = catchAsync(async (req, res) => {
  const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!partner) return sendError(res, 'Partner not found', 404);
  await logActivity('update', 'Partner', partner._id, req.user, `Updated partner: ${partner.name}`);
  sendSuccess(res, partner, 'Partner updated');
});

const deleteOne = catchAsync(async (req, res) => {
  const partner = await Partner.findByIdAndDelete(req.params.id);
  if (!partner) return sendError(res, 'Partner not found', 404);
  await logActivity('delete', 'Partner', partner._id, req.user, `Deleted partner: ${partner.name}`);
  sendSuccess(res, null, 'Partner deleted');
});

module.exports = { getAll, getOne, create, update, deleteOne };
