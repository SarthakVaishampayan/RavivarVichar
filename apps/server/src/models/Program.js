const mongoose = require('mongoose');

const programSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    slug: { type: String, unique: true, lowercase: true },
    banner: { type: String },
    description: { type: String, default: '' },
    tagline: { type: String },
    objectives: [{ type: String }],
    impact: [{ type: String }],
    approach: [{ title: String, description: String }],
    stats: { type: Map, of: String, default: {} },
    icon: { type: String, default: 'Lightbulb' },
    color: { type: String, default: 'primary' },
    gallery: [{ type: String }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    successStories: [{ title: String, summary: String, image: String }],
    faqs: [{ question: String, answer: String }],
    downloads: [{ label: String, fileUrl: String }],
    relatedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  },
  { timestamps: true }
);

programSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

module.exports = mongoose.model('Program', programSchema);
