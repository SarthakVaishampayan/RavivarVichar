const SHG = require('../models/SHG');
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

  const result = await paginate(SHG, filter, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
    search: req.query.search,
    searchFields: ['groupName', 'achievements', 'district'],
  });

  sendSuccess(res, result.data, 'SHGs fetched', 200, result.meta);
});

const getOne = catchAsync(async (req, res) => {
  const shg = await SHG.findById(req.params.id);
  if (!shg) return sendError(res, 'SHG not found', 404);
  sendSuccess(res, shg);
});

const create = catchAsync(async (req, res) => {
  const shg = await SHG.create(req.body);
  await logActivity('create', 'SHG', shg._id, req.user, `Created SHG: ${shg.groupName}`);
  sendSuccess(res, shg, 'SHG created', 201);
});

const update = catchAsync(async (req, res) => {
  const shg = await SHG.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!shg) return sendError(res, 'SHG not found', 404);
  await logActivity('update', 'SHG', shg._id, req.user, `Updated SHG: ${shg.groupName}`);
  sendSuccess(res, shg, 'SHG updated');
});

const deleteOne = catchAsync(async (req, res) => {
  const shg = await SHG.findByIdAndDelete(req.params.id);
  if (!shg) return sendError(res, 'SHG not found', 404);
  await logActivity('delete', 'SHG', shg._id, req.user, `Deleted SHG: ${shg.groupName}`);
  sendSuccess(res, null, 'SHG deleted');
});

module.exports = { getAll, getOne, create, update, deleteOne };
