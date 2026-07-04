const mongoose = require('mongoose');

const mediaMentionSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    source: { type: String, required: [true, 'Source is required'], trim: true },
    url: { type: String, required: [true, 'URL is required'], trim: true },
    summary: { type: String, default: '', trim: true },
    imageUrl: { type: String, default: '' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MediaMention', mediaMentionSchema);
