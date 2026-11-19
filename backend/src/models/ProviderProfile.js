const mongoose = require('mongoose');

const providerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, default: '' },
  experience: { type: Number, default: 0 },
  skills: [{ type: String }],
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  hourlyRate: { type: Number, default: 0 },
  serviceArea: [{ type: String }],
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  serviceRadius: { type: Number, default: 10 },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
  availabilityStatus: { type: Boolean, default: true },
  documents: [{ type: String }],
  availability: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    available: { type: Boolean, default: true },
    startTime: { type: String, default: '09:00' },
    endTime: { type: String, default: '18:00' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('ProviderProfile', providerProfileSchema);
