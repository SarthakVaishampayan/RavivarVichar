const ContactMessage = require('../models/ContactMessage');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/paginate');

// POST /api/v1/contact — public
const submit = catchAsync(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return sendError(res, 'All fields are required', 400);
  }

  const contactMessage = await ContactMessage.create({ name, email, subject, message });
  sendSuccess(res, contactMessage, 'Your message has been sent! We will get back to you soon.', 201);
});

// GET /api/v1/contact — admin only
const getAll = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.read !== undefined) filter.read = req.query.read === 'true';

  const result = await paginate(ContactMessage, filter, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort || '-createdAt',
    search: req.query.search,
    searchFields: ['name', 'email', 'subject', 'message'],
  });
  sendSuccess(res, result.data, 'Messages fetched', 200, result.meta);
});

// GET /api/v1/contact/:id — admin only
const getOne = catchAsync(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);
  if (!message) return sendError(res, 'Message not found', 404);
  // Mark as read when viewed
  if (!message.read) {
    message.read = true;
    await message.save();
  }
  sendSuccess(res, message);
});

// DELETE /api/v1/contact/:id — admin only
const deleteOne = catchAsync(async (req, res) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) return sendError(res, 'Message not found', 404);
  sendSuccess(res, null, 'Message deleted');
});

module.exports = { submit, getAll, getOne, deleteOne };
