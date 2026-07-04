const FeatureRequest = require('../models/FeatureRequest');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/paginate');

// POST /api/v1/feature-requests — public
const submit = catchAsync(async (req, res) => {
  const { name, placeOfWork, typeOfWork, phoneNo } = req.body;
  if (!name || !placeOfWork || !typeOfWork || !phoneNo) {
    return sendError(res, 'All fields are required', 400);
  }

  await FeatureRequest.create({ name, placeOfWork, typeOfWork, phoneNo });
  sendSuccess(res, null, 'Your story has been submitted! We will review it and get back to you.', 201);
});

// GET /api/v1/feature-requests/:id — admin only
const getOne = catchAsync(async (req, res) => {
  const request = await FeatureRequest.findById(req.params.id);
  if (!request) return sendError(res, 'Feature request not found', 404);
  sendSuccess(res, request, 'Feature request fetched');
});

// GET /api/v1/feature-requests — admin only
const getAll = catchAsync(async (req, res) => {
  const result = await paginate(FeatureRequest, {}, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort || '-createdAt',
    search: req.query.search,
    searchFields: ['name', 'placeOfWork', 'typeOfWork', 'phoneNo'],
  });
  sendSuccess(res, result.data, 'Feature requests fetched', 200, result.meta);
});

// PUT /api/v1/feature-requests/:id/status — admin only
const updateStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  if (!['under-consideration', 'approved', 'posted', 'denied'].includes(status)) {
    return sendError(res, 'Invalid status', 400);
  }

  const request = await FeatureRequest.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!request) return sendError(res, 'Feature request not found', 404);
  sendSuccess(res, request, `Request marked as ${status.replace('-', ' ')}`);
});

// DELETE /api/v1/feature-requests/:id — admin only
const deleteOne = catchAsync(async (req, res) => {
  const request = await FeatureRequest.findByIdAndDelete(req.params.id);
  if (!request) return sendError(res, 'Feature request not found', 404);
  sendSuccess(res, null, 'Feature request removed');
});

module.exports = { submit, getAll, getOne, updateStatus, deleteOne };
