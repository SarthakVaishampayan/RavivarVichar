const Testimonial = require('../models/Testimonial');
const ActivityLog = require('../models/ActivityLog');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/paginate');

const logActivity = async (action, resource, resourceId, user, details) => {
  await ActivityLog.create({ action, resource, resourceId, user: user?._id, details });
};

const getAll = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.featured) filter.featured = req.query.featured === 'true';

  const result = await paginate(Testimonial, filter, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
    search: req.query.search,
    searchFields: ['name', 'quote', 'role'],
  });

  sendSuccess(res, result.data, 'Testimonials fetched', 200, result.meta);
});

const getOne = catchAsync(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) return sendError(res, 'Testimonial not found', 404);
  sendSuccess(res, testimonial);
});

const create = catchAsync(async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  await logActivity('create', 'Testimonial', testimonial._id, req.user, `Created testimonial by: ${testimonial.name}`);
  sendSuccess(res, testimonial, 'Testimonial created', 201);
});

const update = catchAsync(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!testimonial) return sendError(res, 'Testimonial not found', 404);
  await logActivity('update', 'Testimonial', testimonial._id, req.user, `Updated testimonial by: ${testimonial.name}`);
  sendSuccess(res, testimonial, 'Testimonial updated');
});

const deleteOne = catchAsync(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) return sendError(res, 'Testimonial not found', 404);
  await logActivity('delete', 'Testimonial', testimonial._id, req.user, `Deleted testimonial by: ${testimonial.name}`);
  sendSuccess(res, null, 'Testimonial deleted');
});

module.exports = { getAll, getOne, create, update, deleteOne };
