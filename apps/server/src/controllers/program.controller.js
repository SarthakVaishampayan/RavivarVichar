const Program = require('../models/Program');
const ActivityLog = require('../models/ActivityLog');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/paginate');

const logActivity = async (action, resource, resourceId, user, details) => {
  await ActivityLog.create({ action, resource, resourceId, user: user?._id, details });
};

// GET /api/v1/programs
const getAll = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (!req.user) filter.status = 'active';

  const result = await paginate(Program, filter, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
    search: req.query.search,
    searchFields: ['title', 'description'],
  });

  sendSuccess(res, result.data, 'Programs fetched', 200, result.meta);
});

// GET /api/v1/programs/:id
const getOne = catchAsync(async (req, res) => {
  const program = await Program.findById(req.params.id).populate('relatedArticles', 'title slug');
  if (!program) return sendError(res, 'Program not found', 404);
  sendSuccess(res, program);
});

// POST /api/v1/programs
const create = catchAsync(async (req, res) => {
  const program = await Program.create(req.body);
  await logActivity('create', 'Program', program._id, req.user, `Created program: ${program.title}`);
  sendSuccess(res, program, 'Program created', 201);
});

// PUT /api/v1/programs/:id
const update = catchAsync(async (req, res) => {
  const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!program) return sendError(res, 'Program not found', 404);
  await logActivity('update', 'Program', program._id, req.user, `Updated program: ${program.title}`);
  sendSuccess(res, program, 'Program updated');
});

// DELETE /api/v1/programs/:id
const deleteOne = catchAsync(async (req, res) => {
  const program = await Program.findByIdAndDelete(req.params.id);
  if (!program) return sendError(res, 'Program not found', 404);
  await logActivity('delete', 'Program', program._id, req.user, `Deleted program: ${program.title}`);
  sendSuccess(res, null, 'Program deleted');
});

module.exports = { getAll, getOne, create, update, deleteOne };
