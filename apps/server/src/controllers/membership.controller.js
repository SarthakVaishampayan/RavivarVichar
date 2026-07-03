const Membership = require('../models/Membership');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/paginate');

// POST /api/v1/membership — public
const apply = catchAsync(async (req, res) => {
  const { name, email, phone, membershipType } = req.body;
  if (!name || !email) {
    return sendError(res, 'Name and email are required', 400);
  }

  const membership = await Membership.create({ name, email, phone, membershipType });
  sendSuccess(res, membership, 'Membership application submitted successfully!', 201);
});

// GET /api/v1/membership — admin only
const getAll = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const result = await paginate(Membership, filter, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort || '-createdAt',
    search: req.query.search,
    searchFields: ['name', 'email', 'phone'],
  });
  sendSuccess(res, result.data, 'Memberships fetched', 200, result.meta);
});

// PUT /api/v1/membership/:id — admin only
const update = catchAsync(async (req, res) => {
  const membership = await Membership.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!membership) return sendError(res, 'Membership not found', 404);
  sendSuccess(res, membership, 'Membership updated');
});

// DELETE /api/v1/membership/:id — admin only
const deleteOne = catchAsync(async (req, res) => {
  const membership = await Membership.findByIdAndDelete(req.params.id);
  if (!membership) return sendError(res, 'Membership not found', 404);
  sendSuccess(res, null, 'Membership deleted');
});

module.exports = { apply, getAll, update, deleteOne };
