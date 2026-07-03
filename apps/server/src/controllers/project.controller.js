const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/paginate');

const logActivity = async (action, resource, resourceId, user, details) => {
  await ActivityLog.create({ action, resource, resourceId, user: user?._id, details });
};

const getAll = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.district) filter['location.district'] = req.query.district;

  const result = await paginate(Project, filter, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
    search: req.query.search,
    searchFields: ['title', 'description', 'location.district'],
  });

  sendSuccess(res, result.data, 'Projects fetched', 200, result.meta);
});

const getOne = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id).populate('partners', 'name logo');
  if (!project) return sendError(res, 'Project not found', 404);
  sendSuccess(res, project);
});

const create = catchAsync(async (req, res) => {
  const project = await Project.create(req.body);
  await logActivity('create', 'Project', project._id, req.user, `Created project: ${project.title}`);
  sendSuccess(res, project, 'Project created', 201);
});

const update = catchAsync(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!project) return sendError(res, 'Project not found', 404);
  await logActivity('update', 'Project', project._id, req.user, `Updated project: ${project.title}`);
  sendSuccess(res, project, 'Project updated');
});

const deleteOne = catchAsync(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return sendError(res, 'Project not found', 404);
  await logActivity('delete', 'Project', project._id, req.user, `Deleted project: ${project.title}`);
  sendSuccess(res, null, 'Project deleted');
});

module.exports = { getAll, getOne, create, update, deleteOne };
