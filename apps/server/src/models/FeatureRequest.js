const mongoose = require('mongoose');

const featureRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    placeOfWork: { type: String, required: [true, 'Place of work is required'], trim: true },
    typeOfWork: { type: String, required: [true, 'Type of work is required'], trim: true },
    phoneNo: { type: String, required: [true, 'Phone number is required'], trim: true },
    storySummary: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['under-consideration', 'approved', 'posted', 'denied'], default: 'under-consideration' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeatureRequest', featureRequestSchema);
