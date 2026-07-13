const mongoose = require('mongoose');

const loadSchema = new mongoose.Schema({
  loadId:      { type: String, unique: true },
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyName: { type: String, default: 'Shipper' },
  mobile:      { type: String },

  origin:      { type: String, required: true },
  destination: { type: String, required: true },
  material:    { type: String, required: true },
  weight:      { type: String, required: true },
  targetPrice: { type: Number, required: true },

  // 🗺️ Geocoded coordinates (populated by mapsController on create)
  originCoords: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },
  destCoords: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },

  // Estimated distance & duration from Google Routes API
  distanceKm:   { type: Number, default: null },
  durationHrs:  { type: Number, default: null },

  status:   { type: String, enum: ['active', 'booked', 'cancelled'], default: 'active' },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

loadSchema.pre('save', function (next) {
  if (!this.loadId) {
    this.loadId = `LOD-${Math.floor(10000 + Math.random() * 90000)}`;
  }
  next();
});

module.exports = mongoose.model('Load', loadSchema);
