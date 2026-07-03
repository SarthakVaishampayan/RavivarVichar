const mongoose = require('mongoose');

const entrepreneurSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    photo: { type: String },
    district: { type: String },
    sector: { type: String },
    bio: { type: String },
    contact: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Entrepreneur', entrepreneurSchema);
