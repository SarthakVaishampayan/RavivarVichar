const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    slug: { type: String, unique: true, lowercase: true },
    category: { type: String, default: 'General' },
    additionalCategories: [{ type: String }],
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    credit: { type: String },
    thumbnail: { type: String },
    gallery: [{ type: String }],
    videoUrl: { type: String },
    content: { type: String, default: '' },
    excerpt: { type: String },
    bannerDescription: { type: String },
    focusKeyphrase: { type: String },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt: { type: Date },
    featured: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      ogImage: { type: String },
      ogTitle: { type: String },
      ogDescription: { type: String },
      twitterTitle: { type: String },
      twitterDescription: { type: String },
      twitterImage: { type: String },
      keywords: [{ type: String }],
      metaNewsKeywords: [{ type: String }],
      canonicalUrl: { type: String },
      schemaType: { type: String, default: 'NewsArticle' },
      excludeFromSearch: { type: Boolean, default: false },
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

articleSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Article', articleSchema);
