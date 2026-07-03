const mongoose = require('mongoose');

const pageSectionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: [
        'hero', 'mission', 'programs', 'research', 'articles',
        'stats', 'projects', 'partners', 'videos', 'testimonials',
        'events', 'membership', 'donate', 'newsletter',
      ],
    },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PageSection', pageSectionSchema);
