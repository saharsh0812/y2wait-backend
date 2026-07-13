const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  bidder:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:  { type: Number, required: true },
  placedAt:{ type: Date, default: Date.now },
});

const corporateDemandSchema = new mongoose.Schema({
  demandId:  { type: String, unique: true },  // e.g. #54321
  postedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  company:   { type: String, required: true },

  demand:    { type: String, required: true },   // "200 Ton Steel"
  route:     { type: String, required: true },   // "Patna - Ranchi"
  deadline:  { type: Date },

  // Reverse auction — lowest bid wins (L1)
  initialL1: { type: Number, required: true },   // opening price
  currentL1: { type: Number },                   // live lowest bid
  l1Holder:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  bids:      [bidSchema],

  status:    { type: String, enum: ['active', 'awarded', 'cancelled'], default: 'active' },
}, { timestamps: true });

corporateDemandSchema.pre('save', function (next) {
  if (!this.demandId) {
    this.demandId = `#${Math.floor(10000 + Math.random() * 90000)}`;
  }
  if (!this.currentL1) {
    this.currentL1 = this.initialL1;
  }
  next();
});

module.exports = mongoose.model('CorporateDemand', corporateDemandSchema);
