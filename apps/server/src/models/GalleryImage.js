const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: [true, 'Image URL is required'] },
    caption: { type: String, default: '', trim: true },
    altText: { type: String, default: '', trim: true },
    // Post Details fields
    title: { type: String, default: '', trim: true },
    slug: { type: String, default: '', trim: true },
    summary: { type: String, default: '', trim: true },
    metaDescription: { type: String, default: '', trim: true },

    // Date Override
    customDate: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
