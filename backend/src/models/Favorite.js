const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Prevent duplicate favorites
favoriteSchema.index({ customerId: 1, providerId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
