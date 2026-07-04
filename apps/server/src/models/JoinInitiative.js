const mongoose = require('mongoose');

const joinInitiativeSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    phoneNo: { type: String, required: [true, 'Phone number is required'], trim: true },
    city: { type: String, required: [true, 'City is required'], trim: true },
    state: { type: String, required: [true, 'State is required'], trim: true },
    reasonToJoin: { type: String, required: [true, 'Reason to join is required'], trim: true },
    briefAboutWork: { type: String, required: [true, 'Brief about work is required'], trim: true },
    status: { type: String, enum: ['under-consideration', 'approved', 'posted', 'denied'], default: 'under-consideration' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JoinInitiative', joinInitiativeSchema);
