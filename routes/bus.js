const express = require('express');
const router = express.Router();
const { getBusSpaces, getMyBusSpaces, createBusSpace, updateBusStatus, deleteBusSpace } = require('../controllers/busController');
const { protect } = require('../middleware/auth');

router.get('/', getBusSpaces);
router.get('/mine', protect, getMyBusSpaces);
router.post('/', protect, createBusSpace);
router.put('/:id/status', protect, updateBusStatus);
router.delete('/:id', protect, deleteBusSpace);

module.exports = router;
