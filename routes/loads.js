const express = require('express');
const router = express.Router();
const { getLoads, getMyLoads, createLoad, updateLoadStatus, deleteLoad } = require('../controllers/loadController');
const { protect } = require('../middleware/auth');

router.get('/', getLoads);                              // public feed
router.get('/mine', protect, getMyLoads);               // my listings
router.post('/', protect, createLoad);
router.put('/:id/status', protect, updateLoadStatus);
router.delete('/:id', protect, deleteLoad);

module.exports = router;
