const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    coverImage: { type: String },
    gallery: [{ type: String }],
    videoUrl: { type: String },
    location: {
      district: { type: String },
      state: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },
    status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
    budget: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    impactNumbers: [{ label: String, value: String }],
    volunteers: [{ name: String, role: String }],
    partners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Partner' }],
    description: { type: String, default: '' },
    updates: [
      {
        date: Date,
        title: String,
        content: String,
        images: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
