const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, required: [true, 'Email is required'] },
    subject: { type: String, required: [true, 'Subject is required'] },
    message: { type: String, required: [true, 'Message is required'] },
    read: { type: Boolean, default: false },
    status: { type: String, enum: ['under-consideration', 'approved', 'posted', 'denied'], default: 'under-consideration' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
