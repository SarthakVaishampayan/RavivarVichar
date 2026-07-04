const mongoose = require('mongoose');

const pageSectionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: [
        'hero', 'programs', 'research', 'partners',
        'mediaMentions', 'testimonials',
      ],
    },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PageSection', pageSectionSchema);
