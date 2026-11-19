const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  schedule: [{
    day: { 
      type: String, 
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    available: { type: Boolean, default: true },
    slots: [{
      startTime: { type: String, required: true }, // e.g. "09:00"
      endTime: { type: String, required: true }    // e.g. "17:00"
    }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Availability', availabilitySchema);
