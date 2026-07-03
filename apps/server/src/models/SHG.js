const mongoose = require('mongoose');

const shgSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: [true, 'Group name is required'], trim: true },
    photo: { type: String },
    members: { type: Number, default: 0 },
    district: { type: String },
    achievements: [{ type: String }],
    contact: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SHG', shgSchema);
