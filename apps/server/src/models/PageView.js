const mongoose = require('mongoose');

const pageViewSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, index: true },
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', index: true },
    referrer: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    ipHash: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

// Index for efficient aggregation queries
pageViewSchema.index({ timestamp: -1 });
pageViewSchema.index({ sessionId: 1, timestamp: -1 });
pageViewSchema.index({ path: 1, timestamp: -1 });

module.exports = mongoose.model('PageView', pageViewSchema);
