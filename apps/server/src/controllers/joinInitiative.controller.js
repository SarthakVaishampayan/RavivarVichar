const JoinInitiative = require('../models/JoinInitiative');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/paginate');

// POST /api/v1/join-initiative — public
const submit = catchAsync(async (req, res) => {
  const { name, phoneNo, city, state, reasonToJoin, briefAboutWork } = req.body;
  if (!name || !phoneNo || !city || !state || !reasonToJoin || !briefAboutWork) {
    return sendError(res, 'All fields are required', 400);
  }

  await JoinInitiative.create({ name, phoneNo, city, state, reasonToJoin, briefAboutWork });
  sendSuccess(res, null, 'Thank you for joining our initiative! We will contact you soon.', 201);
});

// GET /api/v1/join-initiative/:id — admin only
const getOne = catchAsync(async (req, res) => {
  const entry = await JoinInitiative.findById(req.params.id);
  if (!entry) return sendError(res, 'Entry not found', 404);
  sendSuccess(res, entry, 'Entry fetched');
});

// GET /api/v1/join-initiative — admin only
const getAll = catchAsync(async (req, res) => {
  const result = await paginate(JoinInitiative, {}, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort || '-createdAt',
    search: req.query.search,
    searchFields: ['name', 'phoneNo', 'city', 'state'],
  });
  sendSuccess(res, result.data, 'Join initiative entries fetched', 200, result.meta);
});

// PUT /api/v1/join-initiative/:id/status — admin only
const updateStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  if (!['under-consideration', 'approved', 'posted', 'denied'].includes(status)) {
    return sendError(res, 'Invalid status', 400);
  }

  const entry = await JoinInitiative.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!entry) return sendError(res, 'Entry not found', 404);
  sendSuccess(res, entry, `Entry marked as ${status.replace('-', ' ')}`);
});

// DELETE /api/v1/join-initiative/:id — admin only
const deleteOne = catchAsync(async (req, res) => {
  const entry = await JoinInitiative.findByIdAndDelete(req.params.id);
  if (!entry) return sendError(res, 'Entry not found', 404);
  sendSuccess(res, null, 'Entry removed');
});

module.exports = { submit, getAll, getOne, updateStatus, deleteOne };
