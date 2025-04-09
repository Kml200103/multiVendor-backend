const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantName: { type: String, required: true },
  description: { type: String },
  logo: { type: String },
  address: { type: String },
  approved: { type: Boolean, default: false },
  rejected: { type: Boolean, default: false },
  suspend: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Vendor', vendorSchema);