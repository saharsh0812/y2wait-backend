const express = require('express');
const router = express.Router();
const { getDemands, createDemand, placeBid, awardDemand } = require('../controllers/corporateController');
const { protect, roleGuard } = require('../middleware/auth');

router.get('/', getDemands);
router.post('/', protect, roleGuard('corporate'), createDemand);
router.post('/:id/bid', protect, roleGuard('driver', 'transporter'), placeBid);
router.put('/:id/award', protect, roleGuard('corporate'), awardDemand);

module.exports = router;
