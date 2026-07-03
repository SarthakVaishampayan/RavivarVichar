const mongoose = require('mongoose');

const seoMetaSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, unique: true }, // e.g. 'home', 'about', 'article/:slug'
    metaTitle: { type: String },
    metaDescription: { type: String },
    ogImage: { type: String },
    keywords: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('SeoMeta', seoMetaSchema);
