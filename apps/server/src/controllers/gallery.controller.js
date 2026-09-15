const GalleryImage = require('../models/GalleryImage');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

// GET /api/v1/gallery — public
const getAll = catchAsync(async (req, res) => {
  const images = await GalleryImage.find().sort('-createdAt');
  sendSuccess(res, images, 'Gallery images fetched');
});

// POST /api/v1/gallery — admin only
const create = catchAsync(async (req, res) => {
  const { imageUrl, caption, altText, title, slug, summary, metaDescription, customDate } = req.body;
  if (!imageUrl) return sendError(res, 'Image URL is required', 400);

  const image = await GalleryImage.create({
    imageUrl, caption, altText,
    title, slug, summary, metaDescription,
    customDate: customDate || null,
  });
  sendSuccess(res, image, 'Image added to gallery', 201);
});

// PUT /api/v1/gallery/:id — admin only
const update = catchAsync(async (req, res) => {
  const { imageUrl, caption, altText, title, slug, summary, metaDescription, customDate } = req.body;
  const updateData = {};
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
  if (caption !== undefined) updateData.caption = caption;
  if (altText !== undefined) updateData.altText = altText;
  if (title !== undefined) updateData.title = title;
  if (slug !== undefined) updateData.slug = slug;
  if (summary !== undefined) updateData.summary = summary;
  if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
  if (customDate !== undefined) updateData.customDate = customDate || null;

  const image = await GalleryImage.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );
  if (!image) return sendError(res, 'Image not found', 404);
  sendSuccess(res, image, 'Gallery image updated');
});

// DELETE /api/v1/gallery/:id — admin only
const deleteOne = catchAsync(async (req, res) => {
  const image = await GalleryImage.findByIdAndDelete(req.params.id);
  if (!image) return sendError(res, 'Image not found', 404);
  sendSuccess(res, null, 'Image removed from gallery');
});

module.exports = { getAll, create, update, deleteOne };
