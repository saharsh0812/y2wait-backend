const Load = require('../models/Load');

// ── GET ALL LOADS (with optional filters) ─────────────────
const getLoads = async (req, res) => {
  try {
    const { origin, destination, status = 'active' } = req.query;
    const filter = { status };
    if (origin) filter.origin = new RegExp(origin, 'i');
    if (destination) filter.destination = new RegExp(destination, 'i');

    const loads = await Load.find(filter)
      .populate('postedBy', 'firstName businessName dp mobile')
      .sort({ createdAt: -1 });

    return res.status(200).json(loads);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch loads' });
  }
};

// ── GET MY LOADS ──────────────────────────────────────────
const getMyLoads = async (req, res) => {
  try {
    const loads = await Load.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(loads);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch loads' });
  }
};

// ── POST LOAD ─────────────────────────────────────────────
const createLoad = async (req, res) => {
  try {
    const { origin, destination, material, weight, targetPrice } = req.body;
    if (!origin || !destination || !material || !weight || !targetPrice) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const load = await Load.create({
      postedBy: req.user.id,
      companyName: req.user.businessName || req.user.firstName || 'Shipper',
      mobile: req.user.mobile,
      origin, destination, material, weight,
      targetPrice: Number(targetPrice),
    });

    return res.status(201).json(load);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create load', details: err.message });
  }
};

// ── UPDATE LOAD STATUS ────────────────────────────────────
const updateLoadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const load = await Load.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id },
      { status },
      { new: true }
    );
    if (!load) return res.status(404).json({ error: 'Load not found or not authorized' });
    return res.status(200).json(load);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update load' });
  }
};

// ── DELETE LOAD ───────────────────────────────────────────
const deleteLoad = async (req, res) => {
  try {
    const load = await Load.findOneAndDelete({ _id: req.params.id, postedBy: req.user.id });
    if (!load) return res.status(404).json({ error: 'Load not found or not authorized' });
    return res.status(200).json({ message: 'Load deleted' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete load' });
  }
};

module.exports = { getLoads, getMyLoads, createLoad, updateLoadStatus, deleteLoad };
