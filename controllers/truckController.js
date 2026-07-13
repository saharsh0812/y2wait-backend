const Truck = require('../models/Truck');

// ── GET ALL AVAILABLE TRUCKS ──────────────────────────────
const getTrucks = async (req, res) => {
  try {
    const { origin, destination, truckType } = req.query;
    const filter = { status: 'available' };
    if (origin) filter.origin = new RegExp(origin, 'i');
    if (destination) filter.destination = new RegExp(destination, 'i');
    if (truckType) filter.truckType = truckType;

    const trucks = await Truck.find(filter)
      .populate('postedBy', 'firstName dp mobile')
      .sort({ createdAt: -1 });

    return res.status(200).json(trucks);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch trucks' });
  }
};

// ── GET MY TRUCKS ─────────────────────────────────────────
const getMyTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(trucks);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch trucks' });
  }
};

// ── POST TRUCK ────────────────────────────────────────────
const createTruck = async (req, res) => {
  try {
    const { origin, destination, vehicleNumber, truckType, capacity, charges } = req.body;
    if (!origin || !destination || !capacity || !charges) {
      return res.status(400).json({ error: 'origin, destination, capacity, charges are required' });
    }

    const truck = await Truck.create({
      postedBy: req.user.id,
      driverName: req.user.firstName || 'Driver',
      mobile: req.user.mobile,
      origin, destination, vehicleNumber,
      truckType: truckType || 'Open Body',
      capacity, charges: Number(charges),
    });

    return res.status(201).json(truck);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to list truck', details: err.message });
  }
};

// ── UPDATE TRUCK STATUS ───────────────────────────────────
const updateTruckStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const truck = await Truck.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id },
      { status },
      { new: true }
    );
    if (!truck) return res.status(404).json({ error: 'Truck not found or not authorized' });
    return res.status(200).json(truck);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update truck' });
  }
};

// ── DELETE TRUCK ──────────────────────────────────────────
const deleteTruck = async (req, res) => {
  try {
    const truck = await Truck.findOneAndDelete({ _id: req.params.id, postedBy: req.user.id });
    if (!truck) return res.status(404).json({ error: 'Truck not found or not authorized' });
    return res.status(200).json({ message: 'Truck listing removed' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete truck' });
  }
};

module.exports = { getTrucks, getMyTrucks, createTruck, updateTruckStatus, deleteTruck };
