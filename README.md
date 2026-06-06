# CryptoSim — Real-Time Crypto Trading Simulator

> Trade cryptocurrency with virtual money, track live portfolio performance, and compete on a leaderboard — without risking real money.

![MERN](https://img.shields.io/badge/MERN-Full%20Stack-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-black)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## Overview

CryptoSim is a real-time cryptocurrency paper-trading platform built with the MERN stack and Socket.IO.

Every user starts with **₹1,00,000 virtual money** and can trade cryptocurrencies using live prices fetched from CoinGecko. The platform simulates real market behavior while eliminating financial risk, making it ideal for learning trading, portfolio management, and market dynamics.

## Highlights

- ₹1,00,000 virtual starting balance
- Live crypto prices from CoinGecko
- Real-time updates using Socket.IO
- Buy & sell cryptocurrencies
- Live portfolio tracking
- Profit & Loss calculations
- Transaction history
- JWT authentication
- Real-time leaderboard
- Server-side trade validation

## The Problem It Solves

Learning crypto trading with real money is risky.

CryptoSim provides a safe environment where users can understand:

- Market movements
- Portfolio growth and decline
- Buy/Sell decision making
- Trading psychology
- Risk management

All without risking actual funds.

---

## Features

### Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes

### Live Market

- Live prices from CoinGecko
- Updates every 30 seconds
- Socket.IO broadcasting
- BTC, ETH, SOL, DOGE, ADA, XRP

### Trading Engine

- Buy cryptocurrencies
- Sell cryptocurrencies
- Virtual wallet management
- Server-side trade validation

### Portfolio

- Holdings tracking
- Average Buy Price tracking
- Live portfolio valuation
- Real-time Profit & Loss

### Transaction History

- Buy/Sell records
- Trade timestamps
- Historical transactions

### Leaderboard

- Rank users by total net worth
- Live portfolio valuation

## Tech Stack

| Layer | Technology |
|---------|------------|
| Frontend | React 19, React Router v7, Tailwind CSS v4, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Real-Time | Socket.IO |
| Charts | Recharts |
| Market Data | CoinGecko API |
| HTTP Client | Axios |

## Architecture

### Live Market Flow

```text
CoinGecko API
      │
      ▼
Market Engine
(30 sec polling)
      │
 ┌────┴────┐
 ▼         ▼
marketState   marketHistory
      │
      ▼
 Socket.IO
 Broadcast
      │
 ┌────┴────┐
 ▼         ▼
Client A   Client B
```

### Trade Execution Flow

```text
User Request
      │
      ▼
Trade Controller
      │
      ▼
Read Live Price
(Server Memory)
      │
      ▼
Validate Trade
      │
      ▼
Update Wallet
Update Portfolio
Save Transaction
```

## Key Technical Decisions

### Why Socket.IO?

Instead of every client repeatedly requesting market data, the server fetches prices once and broadcasts updates to all connected users. This reduces unnecessary API calls and scales better.

### Why Server-Side Price Validation?

The backend always reads prices from server memory during trade execution. Users cannot manipulate prices through frontend requests.

### Why Store Average Buy Price?

A running weighted average is maintained inside the Portfolio document, avoiding expensive recalculation from transaction history.

### Why Auto-Create Portfolios?

A portfolio is automatically created during registration so users can start trading immediately after login.

## 📂 Project Structure

```text
CryptoSim
│
├── backend
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   ├── tradeController.js
│   │   ├── portfolioController.js
│   │   ├── transactionController.js
│   │   └── leaderboardController.js
│   │
│   ├── middleware
│   │   └── authMiddleware.js
│   │
│   ├── models
│   │   ├── User.js
│   │   ├── Portfolio.js
│   │   └── Transaction.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── tradeRoutes.js
│   │   ├── portfolioRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── leaderboardRoutes.js
│   │
│   ├── market
│   │   ├── marketState.js
│   │   └── marketEngine.js
│   │
│   └── server.js
│
├── frontend
│   └── src
│       ├── pages
│       │   ├── Dashboard.jsx
│       │   ├── Portfolio.jsx
│       │   ├── Buy.jsx
│       │   ├── Sell.jsx
│       │   ├── History.jsx
│       │   ├── Leaderboard.jsx
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       │
│       ├── services
│       │   ├── api.js
│       │   └── socket.js
│       │
│       ├── components
│       │
│       └── App.jsx
│
├── README.md
└── .env
```

##  API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Trading

```http
POST /api/trade/buy
POST /api/trade/sell
```

### Portfolio

```http
GET /api/portfolio
```

### Transactions

```http
GET /api/transactions
```

### Leaderboard

```http
GET /api/leaderboard
```
## Running Locally

### Clone Repository

```bash
git clone https://github.com/your-username/CryptoSim.git

cd CryptoSim
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

Run Backend

```bash
npm run dev
```

### Frontend Setup

```bash
cd ../frontend

npm install

npm run dev
```

Application runs at:

```text
http://localhost:5173
```

## Known Limitations

- Market history is stored in memory and resets on server restart.
- Socket reconnection after JWT expiry is not yet implemented.
- Some UI validation and error handling improvements are in progress.

---

## Ongoing Improvements

- Limit Orders
- UI/UX Improvements
- Backend Optimizations
- Bug Fixes & Edge Case Handling

---

## Resume Highlights

- Built a real-time cryptocurrency trading simulator using MERN and Socket.IO.
- Implemented WebSocket-based live market broadcasting.
- Developed a secure trading engine with server-side price validation.
- Designed portfolio tracking with weighted average cost calculations.
- Created a real-time leaderboard based on live portfolio valuation.

---

##  Author

**Arbaz Ansari**

B.Tech CSE

- GitHub: https://github.com/arbazansari7934

---

 If you found this project useful, consider starring the repository.
