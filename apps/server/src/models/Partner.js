const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    logo: { type: String },
    website: { type: String },
    description: { type: String },
    category: {
      type: String,
      enum: ['government', 'corporate', 'ngo', 'educational'],
      default: 'ngo',
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Partner', partnerSchema);
