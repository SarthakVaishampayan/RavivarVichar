const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: [true, 'Donor name is required'] },
    email: { type: String, required: [true, 'Email is required'] },
    amount: { type: Number, required: [true, 'Amount is required'] },
    currency: { type: String, default: 'INR' },
    purpose: { type: String },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    transactionId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
