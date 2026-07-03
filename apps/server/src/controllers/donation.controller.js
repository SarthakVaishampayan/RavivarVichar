const Donation = require('../models/Donation');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/paginate');

// POST /api/v1/donations — public (record donation intent)
const create = catchAsync(async (req, res) => {
  const { donorName, email, amount, currency, purpose } = req.body;
  if (!donorName || !email || !amount) {
    return sendError(res, 'Donor name, email, and amount are required', 400);
  }

  const donation = await Donation.create({
    donorName,
    email,
    amount,
    currency: currency || 'INR',
    purpose,
    paymentStatus: 'pending',
  });

  sendSuccess(res, donation, 'Donation recorded. Thank you for your generosity!', 201);
});

// GET /api/v1/donations — admin only
const getAll = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.paymentStatus = req.query.status;

  const result = await paginate(Donation, filter, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort || '-createdAt',
    search: req.query.search,
    searchFields: ['donorName', 'email', 'purpose'],
  });
  sendSuccess(res, result.data, 'Donations fetched', 200, result.meta);
});

// PUT /api/v1/donations/:id — admin only
const update = catchAsync(async (req, res) => {
  const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!donation) return sendError(res, 'Donation not found', 404);
  sendSuccess(res, donation, 'Donation updated');
});

// DELETE /api/v1/donations/:id — admin only
const deleteOne = catchAsync(async (req, res) => {
  const donation = await Donation.findByIdAndDelete(req.params.id);
  if (!donation) return sendError(res, 'Donation not found', 404);
  sendSuccess(res, null, 'Donation deleted');
});

module.exports = { create, getAll, update, deleteOne };
