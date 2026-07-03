const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    type: { type: String, enum: ['upcoming', 'past'], default: 'upcoming' },
    gallery: [{ type: String }],
    speakers: [{ name: String, photo: String, bio: String }],
    agenda: [{ time: String, title: String }],
    sponsors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Partner' }],
    location: {
      address: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },
    ticketUrl: { type: String },
    volunteerFormUrl: { type: String },
    registrationDeadline: { type: Date },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
