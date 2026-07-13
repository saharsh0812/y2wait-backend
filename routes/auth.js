const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, register, login, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
