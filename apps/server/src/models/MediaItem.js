const mongoose = require('mongoose');

const mediaItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    type: {
      type: String,
      enum: ['news', 'press-release', 'podcast', 'video'],
      default: 'news',
    },
    url: { type: String },
    thumbnail: { type: String },
    description: { type: String },
    date: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MediaItem', mediaItemSchema);
