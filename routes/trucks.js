const express = require('express');
const router = express.Router();
const { getTrucks, getMyTrucks, createTruck, updateTruckStatus, deleteTruck } = require('../controllers/truckController');
const { protect } = require('../middleware/auth');

router.get('/', getTrucks);                             // public feed
router.get('/mine', protect, getMyTrucks);
router.post('/', protect, createTruck);
router.put('/:id/status', protect, updateTruckStatus);
router.delete('/:id', protect, deleteTruck);

module.exports = router;
