const mongoose = require('mongoose');

const busSpaceSchema = new mongoose.Schema({
  busId:       { type: String, unique: true },  // e.g. BUS-4210
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  operator:    { type: String, required: true },
  mobile:      { type: String },

  route:       { type: String, required: true },     // "Delhi - Jaipur"
  serviceType: { type: String, enum: ['Express', 'Standard', 'Sleeper'], default: 'Standard' },
  capacity:    { type: String, required: true },     // "100 KG Space"
  price:       { type: Number, required: true },     // per KG in INR

  // For cargo sender (trader/shipper posting their goods)
  productType: { type: String, default: '' },
  weight:      { type: String, default: '' },

  busImg:      { type: String, default: '' },
  status:      { type: String, enum: ['available', 'booked'], default: 'available' },
  bookedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

busSpaceSchema.pre('save', function (next) {
  if (!this.busId) {
    this.busId = `BUS-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  next();
});

module.exports = mongoose.model('BusSpace', busSpaceSchema);
