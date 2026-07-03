const Event = require('../models/Event');
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

  const result = await paginate(Event, filter, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort || '-createdAt',
    search: req.query.search,
    searchFields: ['title', 'location.address'],
  });

  sendSuccess(res, result.data, 'Events fetched', 200, result.meta);
});

const getOne = catchAsync(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('sponsors', 'name logo');
  if (!event) return sendError(res, 'Event not found', 404);
  sendSuccess(res, event);
});

const create = catchAsync(async (req, res) => {
  const event = await Event.create(req.body);
  await logActivity('create', 'Event', event._id, req.user, `Created event: ${event.title}`);
  sendSuccess(res, event, 'Event created', 201);
});

const update = catchAsync(async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!event) return sendError(res, 'Event not found', 404);
  await logActivity('update', 'Event', event._id, req.user, `Updated event: ${event.title}`);
  sendSuccess(res, event, 'Event updated');
});

const deleteOne = catchAsync(async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return sendError(res, 'Event not found', 404);
  await logActivity('delete', 'Event', event._id, req.user, `Deleted event: ${event.title}`);
  sendSuccess(res, null, 'Event deleted');
});

module.exports = { getAll, getOne, create, update, deleteOne };
