require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');


// ── DB ────────────────────────────────────────────────────
connectDB();

// ── APP ───────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://loadbhai-logistics.surge.sh',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());

// ── RATE LIMITERS ─────────────────────────────────────────
// OTP route: max 5 requests per 10 minutes per IP
// Prevents Twilio credit drain from abuse
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: { error: 'Too many OTP requests. Please wait 10 minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API: max 100 requests per minute per IP
const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: { error: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general limiter to all routes
app.use('/api/', generalLimiter);

// Apply strict limiter to OTP route only
app.use('/api/auth/send-otp', otpLimiter);

// ── ROUTES ────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/loads',     require('./routes/loads'));
app.use('/api/trucks',    require('./routes/trucks'));
app.use('/api/bus',       require('./routes/bus'));
app.use('/api/corporate', require('./routes/corporate'));
app.use('/api/maps',      require('./routes/maps'));
app.use('/api/ai',        require('./routes/ai'));

// ── HEALTH CHECK ──────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ── 404 HANDLER ───────────────────────────────────────────
// Catches requests to routes that don't exist
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// ── GLOBAL ERROR HANDLER ──────────────────────────────────
// Catches any unexpected crash in any route/controller
// Without this, the request would just hang forever
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong on the server',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ── START ─────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 LoadBhai API running on port ${PORT}`);
});