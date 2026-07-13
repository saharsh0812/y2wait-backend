const Truck = require('../models/Truck');
const Load  = require('../models/Load');
const { geocode, reverseGeocode, getRoute } = require('../config/maps');

// ── GET ROUTE between two city names ──────────────────────
// GET /api/maps/route?origin=Patna&destination=Mumbai
const getRouteBetweenCities = async (req, res) => {
  try {
    const { origin, destination } = req.query;
    if (!origin || !destination) return res.status(400).json({ error: 'origin and destination required' });

    const [originCoords, destCoords] = await Promise.all([geocode(origin), geocode(destination)]);
    if (!originCoords.lat || !destCoords.lat) {
      return res.status(404).json({ error: 'Could not geocode one or both locations' });
    }

    const route = await getRoute(originCoords, destCoords);
    return res.status(200).json({ origin: originCoords, destination: destCoords, ...route });
  } catch (err) {
    return res.status(500).json({ error: 'Maps API error', details: err.message });
  }
};

// ── GET ALL LIVE TRUCK POSITIONS ──────────────────────────
// GET /api/maps/trucks/live
const getLiveTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find({
      status: 'in_transit',
      'liveLocation.lat': { $ne: null },
    }).select('truckId driverName truckType liveLocation origin destination status');

    return res.status(200).json(trucks);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch live trucks' });
  }
};

// ── UPDATE TRUCK LIVE LOCATION (called by driver app) ─────
// PUT /api/maps/trucks/:id/location
const updateTruckLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });

    // Reverse geocode to get a human-readable address label
    const address = await reverseGeocode(lat, lng);

    const truck = await Truck.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id },
      {
        'liveLocation.lat': lat,
        'liveLocation.lng': lng,
        'liveLocation.address': address,
        'liveLocation.updatedAt': new Date(),
      },
      { new: true }
    );

    if (!truck) return res.status(404).json({ error: 'Truck not found or not authorized' });
    return res.status(200).json({ message: 'Location updated', liveLocation: truck.liveLocation });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update location' });
  }
};

// ── GET ROUTE for a specific Load ─────────────────────────
// GET /api/maps/loads/:id/route
const getLoadRoute = async (req, res) => {
  try {
    const load = await Load.findById(req.params.id);
    if (!load) return res.status(404).json({ error: 'Load not found' });

    // Return cached route if already computed
    if (load.distanceKm) {
      return res.status(200).json({
        origin:      load.originCoords,
        destination: load.destCoords,
        distanceKm:  load.distanceKm,
        durationHrs: load.durationHrs,
      });
    }

    // Geocode fresh
    const [originCoords, destCoords] = await Promise.all([
      geocode(load.origin),
      geocode(load.destination),
    ]);

    const route = await getRoute(originCoords, destCoords);

    // Persist to DB so we don't re-geocode on every request
    load.originCoords = originCoords;
    load.destCoords   = destCoords;
    load.distanceKm   = route.distanceKm;
    load.durationHrs  = route.durationHrs;
    await load.save();

    return res.status(200).json({ origin: originCoords, destination: destCoords, ...route });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get route for load' });
  }
};

module.exports = { getRouteBetweenCities, getLiveTrucks, updateTruckLocation, getLoadRoute };
