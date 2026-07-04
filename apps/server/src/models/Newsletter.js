const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true },
    subscribed: { type: Boolean, default: true },
    subscribedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['under-consideration', 'approved', 'posted', 'denied'], default: 'under-consideration' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Newsletter', newsletterSchema);
