const mongoose = require('mongoose');

const providerDocumentSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  documentType: { type: String, enum: ['ID_PROOF', 'ADDRESS_PROOF', 'CERTIFICATION'], required: true },
  documentUrl: { type: String, required: true },
  verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
  verifiedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('ProviderDocument', providerDocumentSchema);
