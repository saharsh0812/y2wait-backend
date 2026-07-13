# 🚛 LoadBhai — India's Freight Matching Platform

> **Rapido for Trucks.** Connecting drivers, transporters, traders, and corporates in real-time — eliminating middlemen and empty returns across India's road logistics network.

![LoadBhai Banner](https://images.unsplash.com/photo-1586528116311-ad8ed7b66bfc?auto=format&fit=crop&q=80&w=1200&h=400)

---

## 🏗️ Architecture

```
loadbhai-backend/
├── server.js              # Express API server (Twilio OTP + MongoDB)
├── models/
│   ├── Load.js            # Mongoose schema for freight loads
│   └── User.js            # Mongoose schema for users
├── .env                   # Environment config (not committed)
└── frontend/              # Vite + React + TypeScript + Tailwind v4
    └── src/
        ├── App.tsx                # Root state orchestrator
        ├── api.ts                 # Centralized backend API utility (axios)
        ├── constants.ts           # Static data (features, products, headers)
        └── components/
            ├── AppHeader.tsx      # Sticky navbar + language toggle
            ├── LandingView.tsx    # Hero, stats, features, testimonials
            ├── DashboardView.tsx  # Freight / Bus Cargo / Mandi / Corporate modules
            ├── FeatureDetailView.tsx # Feature deep-dive page
            └── SupplementaryViews.tsx # About, Services, Pricing, QR, Contact
```

---

## 🚀 Features

### User Roles
| Role | What they do |
|---|---|
| 🚛 **Driver** | List their truck availability, find return loads, earn more per trip |
| 🏢 **Transporter** | Manage fleet listings, bid on enterprise contracts |
| 🌾 **Trader** | Post freight loads, book bus cargo space for agricultural goods |
| 🏗️ **Corporate** | Post large-volume auction demands, receive competitive L1 bids |

### Core Modules
- **Freight Exchange** — Real-time load ↔ truck matching feed with search & capacity filters
- **Bus Cargo** — Book/list small cargo space on intercity bus routes
- **Fleet Mandi** — Group buying for engine oil, tyres, spare parts at wholesale prices
- **Enterprise Auctions** — Reverse bidding system (L1 pricing) for bulk B2B loads
- **Safe QR** — Upload DL, RC, Insurance, Permit → generate verified highway QR code
- **Live Radar** — Track active truck positions on map (mock, API-ready)

### Auth Flow
1. User enters 10-digit mobile number
2. OTP sent via **Twilio** (sandbox fallback shows code in alert)
3. OTP verified → KYC form → Account created
4. JWT-ready session (full JWT implementation next milestone)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite 8, Tailwind CSS v4 |
| Backend | Node.js, Express 5 |
| Database | MongoDB + Mongoose |
| OTP / SMS | Twilio |
| API Client | Axios |
| Icons | Lucide React |
| Deployment | Surge (frontend) / Render (backend) |

---

## ⚙️ Setup & Run

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`)
- Twilio account (or use sandbox mode — OTP appears in API response)

### 1. Backend
```bash
# Install dependencies
npm install

# Copy env and fill in your values
cp .env.example .env

# Start the API server
node server.js
# → Running on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
# → Running on http://localhost:5173
```

### 3. Run Both Together
```bash
# From the root directory
npm run dev
```

---

## 🔌 API Reference

### Auth
```
POST /api/auth/send-otp    { mobileNum: "9876543210" }
POST /api/auth/verify-otp  { mobileNum, otpVal }
```

### Loads
```
GET  /api/loads            → Returns all freight loads
POST /api/loads            { origin, dest, material, weight, price }
```

### AI Chatbot (Placeholder)
```
POST /api/ai/chat          { userMessage: "Find loads from Delhi" }
```

---

## 🗺️ Roadmap

- [x] Monolithic React app → Modular component architecture
- [x] Express backend with Twilio OTP auth
- [x] MongoDB models (Load, User)
- [x] Frontend → Backend API integration (loads fetch + post)
- [ ] JWT token-based persistent login
- [ ] Truck / Bus listing API endpoints
- [ ] User profile persistence (MongoDB)
- [ ] Real-time load feed via WebSockets
- [ ] Google Maps integration for live truck radar
- [ ] Gemini AI chatbot integration

---

## 📄 License

MIT — Built with ❤️ for India's 14 million truck drivers.
