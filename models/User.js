const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobile:       { type: String, required: true, unique: true, index: true },
  role:         { type: String, enum: ['driver', 'transporter', 'trader', 'corporate'], required: true },
  firstName:    { type: String, default: '' },
  lastName:     { type: String, default: '' },
  businessName: { type: String, default: '' },
  gst:          { type: String, default: '' },
  dl:           { type: String, default: '' },
  dp:           { type: String, default: '' },   // profile pic URL
  password:     { type: String, required: true },
  isVerified:   { type: Boolean, default: false },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
