const Newsletter = require('../models/Newsletter');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/paginate');

// POST /api/v1/newsletter/subscribe — public
const subscribe = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) return sendError(res, 'Email is required', 400);

  const existing = await Newsletter.findOne({ email });
  if (existing) {
    if (existing.subscribed) {
      return sendSuccess(res, null, 'You are already subscribed!');
    }
    existing.subscribed = true;
    existing.subscribedAt = new Date();
    await existing.save();
    return sendSuccess(res, null, 'Welcome back! You have been re-subscribed.');
  }

  await Newsletter.create({ email });
  sendSuccess(res, null, 'Successfully subscribed to our newsletter!', 201);
});

// GET /api/v1/newsletter — admin only
const getAll = catchAsync(async (req, res) => {
  const result = await paginate(Newsletter, {}, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort || '-createdAt',
    search: req.query.search,
    searchFields: ['email'],
  });
  sendSuccess(res, result.data, 'Subscribers fetched', 200, result.meta);
});

// DELETE /api/v1/newsletter/:id — admin only
const deleteOne = catchAsync(async (req, res) => {
  const subscriber = await Newsletter.findByIdAndDelete(req.params.id);
  if (!subscriber) return sendError(res, 'Subscriber not found', 404);
  sendSuccess(res, null, 'Subscriber removed');
});

module.exports = { subscribe, getAll, deleteOne };
