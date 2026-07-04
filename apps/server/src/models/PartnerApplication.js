const mongoose = require('mongoose');

const partnerApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    organization: { type: String, required: [true, 'Organization is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], trim: true },
    phoneNo: { type: String, required: [true, 'Phone number is required'], trim: true },
    message: { type: String, default: '', trim: true },
    status: { type: String, enum: ['under-consideration', 'approved', 'posted', 'denied'], default: 'under-consideration' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PartnerApplication', partnerApplicationSchema);
