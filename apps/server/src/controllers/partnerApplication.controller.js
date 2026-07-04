const PartnerApplication = require('../models/PartnerApplication');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/paginate');

// POST /api/v1/partner-applications — public
const submit = catchAsync(async (req, res) => {
  const { name, organization, email, phoneNo, message } = req.body;
  if (!name || !organization || !email || !phoneNo) {
    return sendError(res, 'Name, organization, email, and phone number are required', 400);
  }

  await PartnerApplication.create({ name, organization, email, phoneNo, message });
  sendSuccess(res, null, 'Thank you for your interest in partnering with us! We will get back to you soon.', 201);
});

// GET /api/v1/partner-applications/:id — admin only
const getOne = catchAsync(async (req, res) => {
  const app = await PartnerApplication.findById(req.params.id);
  if (!app) return sendError(res, 'Application not found', 404);
  sendSuccess(res, app, 'Application fetched');
});

// GET /api/v1/partner-applications — admin only
const getAll = catchAsync(async (req, res) => {
  const result = await paginate(PartnerApplication, {}, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort || '-createdAt',
    search: req.query.search,
    searchFields: ['name', 'organization', 'email'],
  });
  sendSuccess(res, result.data, 'Partner applications fetched', 200, result.meta);
});

// PUT /api/v1/partner-applications/:id/status — admin only
const updateStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  if (!['under-consideration', 'approved', 'posted', 'denied'].includes(status)) {
    return sendError(res, 'Invalid status', 400);
  }

  const app = await PartnerApplication.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!app) return sendError(res, 'Application not found', 404);
  sendSuccess(res, app, `Application marked as ${status.replace('-', ' ')}`);
});

// DELETE /api/v1/partner-applications/:id — admin only
const deleteOne = catchAsync(async (req, res) => {
  const app = await PartnerApplication.findByIdAndDelete(req.params.id);
  if (!app) return sendError(res, 'Application not found', 404);
  sendSuccess(res, null, 'Application removed');
});

module.exports = { submit, getAll, getOne, updateStatus, deleteOne };
