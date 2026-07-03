const Report = require('../models/Report');
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
  if (req.query.year) filter.year = parseInt(req.query.year);

  const result = await paginate(Report, filter, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort || '-year',
    search: req.query.search,
    searchFields: ['title', 'author', 'summary'],
  });

  sendSuccess(res, result.data, 'Reports fetched', 200, result.meta);
});

const getOne = catchAsync(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) return sendError(res, 'Report not found', 404);
  sendSuccess(res, report);
});

const create = catchAsync(async (req, res) => {
  const report = await Report.create(req.body);
  await logActivity('create', 'Report', report._id, req.user, `Created report: ${report.title}`);
  sendSuccess(res, report, 'Report created', 201);
});

const update = catchAsync(async (req, res) => {
  const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!report) return sendError(res, 'Report not found', 404);
  await logActivity('update', 'Report', report._id, req.user, `Updated report: ${report.title}`);
  sendSuccess(res, report, 'Report updated');
});

const deleteOne = catchAsync(async (req, res) => {
  const report = await Report.findByIdAndDelete(req.params.id);
  if (!report) return sendError(res, 'Report not found', 404);
  await logActivity('delete', 'Report', report._id, req.user, `Deleted report: ${report.title}`);
  sendSuccess(res, null, 'Report deleted');
});

module.exports = { getAll, getOne, create, update, deleteOne };
