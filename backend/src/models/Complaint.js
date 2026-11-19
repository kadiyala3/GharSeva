const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { 
    type: String, 
    enum: ['Service Quality', 'Late Arrival', 'Provider Behaviour', 'Incorrect Price', 'Payment Issue', 'Other'],
    required: true
  },
  description: { type: String, required: true },
  images: [{ type: String }],
  status: { type: String, enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED'], default: 'OPEN' },
  adminResponse: { type: String },
  resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
