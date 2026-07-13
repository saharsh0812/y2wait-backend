const express = require('express');
const router  = express.Router();
const { getRouteBetweenCities, getLiveTrucks, updateTruckLocation, getLoadRoute } = require('../controllers/mapsController');
const { protect } = require('../middleware/auth');

// Public — anyone can query routes
router.get('/route',            getRouteBetweenCities);   // ?origin=Patna&destination=Mumbai
router.get('/trucks/live',      getLiveTrucks);            // all in-transit trucks on map

// Protected — driver updates their own GPS
router.put('/trucks/:id/location', protect, updateTruckLocation);

// Route info for a specific load
router.get('/loads/:id/route',  getLoadRoute);

module.exports = router;
