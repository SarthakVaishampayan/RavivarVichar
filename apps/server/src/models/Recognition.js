const mongoose = require('mongoose');

const recognitionSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    slug: { type: String, unique: true, lowercase: true },
    source: { type: String, required: [true, 'Source is required'], trim: true },
    url: { type: String, default: '', trim: true },
    summary: { type: String, default: '', trim: true },
    imageUrl: { type: String, default: '' },
    gallery: [{ type: String }],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

recognitionSchema.pre('save', function (next) {
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

module.exports = mongoose.model('Recognition', recognitionSchema);
