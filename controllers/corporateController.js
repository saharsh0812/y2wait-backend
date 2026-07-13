const CorporateDemand = require('../models/CorporateDemand');

// ── GET ALL ACTIVE DEMANDS ────────────────────────────────
const getDemands = async (req, res) => {
  try {
    const demands = await CorporateDemand.find({ status: 'active' })
      .populate('postedBy', 'businessName dp')
      .populate('l1Holder', 'firstName businessName')
      .sort({ createdAt: -1 });
    return res.status(200).json(demands);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch demands' });
  }
};

// ── POST NEW DEMAND ───────────────────────────────────────
const createDemand = async (req, res) => {
  try {
    const { demand, route, initialL1, deadline } = req.body;
    if (!demand || !route || !initialL1) {
      return res.status(400).json({ error: 'demand, route, initialL1 are required' });
    }

    const doc = await CorporateDemand.create({
      postedBy: req.user.id,
      company: req.user.businessName || req.user.firstName || 'Corporate',
      demand, route,
      initialL1: Number(initialL1),
      currentL1: Number(initialL1),
      deadline: deadline ? new Date(deadline) : null,
    });

    return res.status(201).json(doc);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to post demand', details: err.message });
  }
};

// ── PLACE BID (L1 reverse auction) ───────────────────────
const placeBid = async (req, res) => {
  try {
    const { amount } = req.body;
    const bidAmount = Number(amount);

    const demand = await CorporateDemand.findById(req.params.id);
    if (!demand) return res.status(404).json({ error: 'Demand not found' });
    if (demand.status !== 'active') return res.status(400).json({ error: 'Bidding is closed' });
    if (bidAmount >= demand.currentL1) {
      return res.status(400).json({ error: `Bid must be lower than current L1 (₹${demand.currentL1})` });
    }

    demand.bids.push({ bidder: req.user.id, amount: bidAmount });
    demand.currentL1 = bidAmount;
    demand.l1Holder = req.user.id;
    await demand.save();

    return res.status(200).json({ message: 'Bid placed! You are now L1.', currentL1: demand.currentL1 });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to place bid' });
  }
};

// ── AWARD DEMAND ──────────────────────────────────────────
const awardDemand = async (req, res) => {
  try {
    const demand = await CorporateDemand.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id },
      { status: 'awarded' },
      { new: true }
    );
    if (!demand) return res.status(404).json({ error: 'Demand not found or not authorized' });
    return res.status(200).json({ message: 'Demand awarded to L1 bidder', demand });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to award demand' });
  }
};

module.exports = { getDemands, createDemand, placeBid, awardDemand };
