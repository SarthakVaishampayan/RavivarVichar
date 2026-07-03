const express = require('express');
const router = express.Router();
const PageSection = require('../models/PageSection');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const { protect } = require('../middlewares/auth.middleware');

// GET /api/v1/homepage — Get all sections ordered
const getAllSections = catchAsync(async (req, res) => {
  const sections = await PageSection.find().sort('order');
  sendSuccess(res, sections);
});

// PUT /api/v1/homepage/sections — Update section order/visibility (admin only)
const updateSections = catchAsync(async (req, res) => {
  const { sections } = req.body; // [{ key, order, visible }]
  if (!Array.isArray(sections)) return sendError(res, 'sections array is required', 400);

  const ops = sections.map((s) => ({
    updateOne: {
      filter: { key: s.key },
      update: { $set: { order: s.order, visible: s.visible } },
      upsert: true,
    },
  }));

  await PageSection.bulkWrite(ops);
  const updated = await PageSection.find().sort('order');
  sendSuccess(res, updated, 'Sections updated');
});

router.get('/', getAllSections);
router.put('/sections', protect, updateSections);

module.exports = router;
