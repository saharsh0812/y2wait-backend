const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const twilio = require('twilio');

const hasTwilioCreds =
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_ACCOUNT_SID.startsWith('AC') &&
  process.env.TWILIO_AUTH_TOKEN;

const twilioClient = hasTwilioCreds
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

if (!hasTwilioCreds) {
  console.warn('[Twilio] Valid credentials not found — running in DEV FALLBACK mode (OTP returned in API response, no real SMS sent)');
}

// In-memory OTP store (swap with Redis in production)
const otpStore = {};

// ── SEND OTP ─────────────────────────────────────────────
const sendOtp = async (req, res) => {
  try {
    const { mobileNum, password, role } = req.body; 

    if (!mobileNum || mobileNum.length !== 10) {
      return res.status(400).json({ error: 'Valid 10-digit mobile number required' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required to log in' });
    }

    const user = await User.findOne({ mobile: mobileNum });
    if (!user) {
      return res.status(404).json({ error: 'Account not found. Please create an account first.' });
    }

    if (role && user.role !== role) {
      console.log(`❌ Role mismatch: ${mobileNum} tried to log in as ${role} but is a ${user.role}`);
      return res.status(403).json({ 
        error: `Account exists, but it is registered as a '${user.role}'. Please select the correct role to log in.` 
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore[mobileNum] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 }; 

    console.log(`[OTP] ${mobileNum} → ${otp}`);
    
    if (!twilioClient) {
      return res.status(200).json({ success: true, message: `[DEV FALLBACK] OTP is: ${otp}` });
    }

    await twilioClient.messages.create({
      body: `\n[LoadBhai Logistics]\nRam Ram Bhai!\n\nYour Secure Login Code: ${otp}\nValid for 10 minutes.`,
      from: process.env.TWILIO_PHONE,
      to: `+91${mobileNum}`
    });
    
    return res.status(200).json({ success: true, message: 'OTP Sent successfully to your mobile!' });

  } catch (err) {
    console.error('❌ OTP Error:', err.message);
    const fallbackOtp = otpStore[req.body.mobileNum]?.otp;
    if (fallbackOtp) {
      return res.status(200).json({ success: true, message: `[DEV FALLBACK] OTP is: ${fallbackOtp}` });
    }
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// ── VERIFY OTP ────────────────────────────────────────────
const verifyOtp = (req, res) => {
  const { mobileNum, otp } = req.body; 

  const record = otpStore[mobileNum];

  if (!record) {
      return res.status(400).json({ verified: false, error: 'OTP not found or expired' });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[mobileNum];
    return res.status(400).json({ verified: false, error: 'OTP expired' });
  }

  if (String(record.otp) !== String(otp)) {
    return res.status(400).json({ verified: false, error: 'Incorrect OTP' });
  }

  delete otpStore[mobileNum];
  return res.status(200).json({ verified: true });
};

// ── REGISTER ──────────────────────────────────────────────
const register = async (req, res) => {
  try {
    console.log("📥 RECEIVED FROM REACT:", req.body);

    const { mobileNum, role, firstName, lastName, businessName, gst, dl, password } = req.body;
    const mobile = mobileNum || req.body.mobile; 

    if (!mobile || !password) {
      console.error("❌ Registration rejected. Mobile:", mobile, "| Password exists:", !!password);
      return res.status(400).json({ error: 'Mobile number and password are strictly required' });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ FATAL ERROR: JWT_SECRET is missing");
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const exists = await User.findOne({ mobile });
    if (exists) return res.status(409).json({ error: 'Mobile number already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      mobile, role, firstName, lastName, businessName, gst, dl, password: hashed, isVerified: true,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return res.status(201).json({ token, user: _safeUser(user) });
    
  } catch (err) {
    console.error("❌ CRASH IN REGISTER ROUTE:", err); 
    return res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

// ── LOGIN ─────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { mobileNum, password, role } = req.body;
    const mobile = mobileNum || req.body.mobile; 

    if (!mobile || !password) {
      return res.status(400).json({ error: 'Please provide both mobile number and password' });
    }
    
    const user = await User.findOne({ mobile });
    
    if (!user) {
      return res.status(404).json({ error: 'First create an account then try to login' });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ 
        error: `Access Denied: This account belongs to a ${user.role}.` 
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Incorrect password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return res.status(200).json({ token, user: _safeUser(user) });
  } catch (err) {
    console.error("❌ CRASH IN LOGIN ROUTE:", err);
    return res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

// ── GET PROFILE ───────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error("❌ GET PROFILE: req.user is undefined. Did you forget the auth middleware?");
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    return res.status(200).json(user);
  } catch (err) {
    console.error("❌ CRASH IN GET PROFILE:", err);
    return res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
  }
};

// ── UPDATE PROFILE ────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error("❌ UPDATE PROFILE: req.user is undefined. Did you forget the auth middleware?");
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    const { firstName, lastName, businessName, dp } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, businessName, dp },
      { new: true } 
    ).select('-password');
    
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.status(200).json(user);
  } catch (err) {
    console.error("❌ CRASH IN UPDATE PROFILE:", err);
    return res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
};

// ── HELPER ────────────────────────────────────────────────
const _safeUser = (u) => ({
  id: u._id,
  mobile: u.mobile,
  role: u.role,
  firstName: u.firstName,
  lastName: u.lastName,
  businessName: u.businessName,
  dp: u.dp,
  isVerified: u.isVerified,
});

module.exports = { sendOtp, verifyOtp, register, login, getProfile, updateProfile };