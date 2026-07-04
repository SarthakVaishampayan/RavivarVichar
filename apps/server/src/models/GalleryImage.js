const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: [true, 'Image URL is required'] },
    caption: { type: String, default: '', trim: true },
    altText: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
