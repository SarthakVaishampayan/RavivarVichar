const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    photo: { type: String },
    skills: [{ type: String }],
    availability: { type: String },
    experience: { type: String },
    contact: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mentor', mentorSchema);
