const mongoose = require('mongoose');

const programSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    banner: { type: String },
    description: { type: String, default: '' },
    objectives: [{ type: String }],
    gallery: [{ type: String }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    successStories: [{ title: String, summary: String, image: String }],
    faqs: [{ question: String, answer: String }],
    downloads: [{ label: String, fileUrl: String }],
    relatedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Program', programSchema);
