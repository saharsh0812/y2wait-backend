const BusSpace = require('../models/BusSpace');

// ── GET ALL BUS SPACE ─────────────────────────────────────
const getBusSpaces = async (req, res) => {
  try {
    const { route, serviceType } = req.query;
    const filter = { status: 'available' };
    if (route) filter.route = new RegExp(route, 'i');
    if (serviceType) filter.serviceType = serviceType;

    const spaces = await BusSpace.find(filter)
      .populate('postedBy', 'firstName businessName dp mobile')
      .sort({ createdAt: -1 });

    return res.status(200).json(spaces);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch bus spaces' });
  }
};

// ── GET MY BUS LISTINGS ───────────────────────────────────
const getMyBusSpaces = async (req, res) => {
  try {
    const spaces = await BusSpace.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(spaces);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch listings' });
  }
};

// ── POST BUS SPACE ────────────────────────────────────────
const createBusSpace = async (req, res) => {
  try {
    const { route, serviceType, capacity, price, productType, weight } = req.body;
    if (!route || !capacity || !price) {
      return res.status(400).json({ error: 'route, capacity, price are required' });
    }

    const space = await BusSpace.create({
      postedBy: req.user.id,
      operator: req.user.businessName || req.user.firstName || 'Operator',
      mobile: req.user.mobile,
      route, serviceType: serviceType || 'Standard',
      capacity, price: Number(price),
      productType, weight,
    });

    return res.status(201).json(space);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to list bus space', details: err.message });
  }
};

// ── UPDATE BUS SPACE STATUS ───────────────────────────────
const updateBusStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const space = await BusSpace.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id },
      { status },
      { new: true }
    );
    if (!space) return res.status(404).json({ error: 'Listing not found or not authorized' });
    return res.status(200).json(space);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update listing' });
  }
};

// ── DELETE BUS SPACE ──────────────────────────────────────
const deleteBusSpace = async (req, res) => {
  try {
    const space = await BusSpace.findOneAndDelete({ _id: req.params.id, postedBy: req.user.id });
    if (!space) return res.status(404).json({ error: 'Listing not found or not authorized' });
    return res.status(200).json({ message: 'Listing removed' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete listing' });
  }
};

module.exports = { getBusSpaces, getMyBusSpaces, createBusSpace, updateBusStatus, deleteBusSpace };
