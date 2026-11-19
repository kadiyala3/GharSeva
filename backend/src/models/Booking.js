const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingNumber: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  address: {
    addressLine: String,
    area: String,
    city: String,
    state: String,
    pincode: String
  },
  bookingDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String },
  problemDescription: { type: String, required: true },
  problemImages: [{ type: String }],
  estimatedPrice: { type: Number, required: true },
  finalPrice: { type: Number },
  paymentStatus: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'], default: 'PENDING' },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CONFIRMED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'], 
    default: 'PENDING' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
