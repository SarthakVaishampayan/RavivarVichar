const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    pdfUrl: { type: String },
    thumbnail: { type: String },
    category: { type: String, default: 'Research' },
    tags: [{ type: String }],
    downloadsCount: { type: Number, default: 0 },
    citation: { type: String },
    author: { type: String },
    summary: { type: String },
    references: [{ type: String }],
    doi: { type: String },
    year: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
