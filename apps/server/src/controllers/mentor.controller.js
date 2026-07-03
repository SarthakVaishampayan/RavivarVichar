const Mentor = require('../models/Mentor');
const ActivityLog = require('../models/ActivityLog');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/paginate');

const logActivity = async (action, resource, resourceId, user, details) => {
  await ActivityLog.create({ action, resource, resourceId, user: user?._id, details });
};

const getAll = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.skill) filter.skills = { $in: [req.query.skill] };

  const result = await paginate(Mentor, filter, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
    search: req.query.search,
    searchFields: ['name', 'skills', 'experience'],
  });

  sendSuccess(res, result.data, 'Mentors fetched', 200, result.meta);
});

const getOne = catchAsync(async (req, res) => {
  const mentor = await Mentor.findById(req.params.id);
  if (!mentor) return sendError(res, 'Mentor not found', 404);
  sendSuccess(res, mentor);
});

const create = catchAsync(async (req, res) => {
  const mentor = await Mentor.create(req.body);
  await logActivity('create', 'Mentor', mentor._id, req.user, `Created mentor: ${mentor.name}`);
  sendSuccess(res, mentor, 'Mentor created', 201);
});

const update = catchAsync(async (req, res) => {
  const mentor = await Mentor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!mentor) return sendError(res, 'Mentor not found', 404);
  await logActivity('update', 'Mentor', mentor._id, req.user, `Updated mentor: ${mentor.name}`);
  sendSuccess(res, mentor, 'Mentor updated');
});

const deleteOne = catchAsync(async (req, res) => {
  const mentor = await Mentor.findByIdAndDelete(req.params.id);
  if (!mentor) return sendError(res, 'Mentor not found', 404);
  await logActivity('delete', 'Mentor', mentor._id, req.user, `Deleted mentor: ${mentor.name}`);
  sendSuccess(res, null, 'Mentor deleted');
});

module.exports = { getAll, getOne, create, update, deleteOne };
