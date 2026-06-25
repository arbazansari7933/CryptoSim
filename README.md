# CryptoSim — Crypto Trading Simulator

![MERN](https://img.shields.io/badge/MERN-Full%20Stack-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-black)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

A real-time crypto trading simulator built with the MERN stack and Socket.IO. Every user starts with ₹1,00,000 virtual money and trades live coin prices streamed directly from Coinbase's public ticker feed. Place market orders or set limit orders that auto-execute when the price hits your target. No real money. Real market behaviour.

🔴 [Live Demo](https://cryptosim-gamma.vercel.app/) | [⌥ GitHub](https://github.com/arbazansari7933/CryptoSim)

---
## Screenshots

<table>
  <tr>
    <td align="center">
      <b>Dashboard</b><br>
      <img src="./screenshots/dashboard.png" width="450"/>
    </td>
    <td align="center">
      <b>Trade</b><br>
      <img src="./screenshots/trade.png" width="450"/>
    </td>
  </tr>

  <tr>
    <td align="center">
      <b>Portfolio</b><br>
      <img src="./screenshots/portfolio.png" width="450"/>
    </td>
    <td align="center">
      <b>Orders</b><br>
      <img src="./screenshots/order.png" width="450"/>
    </td>
  </tr>

  <tr>
    <td align="center">
      <b>History</b><br>
      <img src="./screenshots/history.png" width="450"/>
    </td>
    <td align="center">
      <b>Leaderboard</b><br>
      <img src="./screenshots/leaderboard.png" width="450"/>
    </td>
  </tr>
</table>

## Features

- True real-time crypto prices streamed via Coinbase's public WebSocket feed
- Market Buy/Sell orders
- Automated Limit Orders with per-order locking against duplicate execution
- Atomic, transaction-safe trade execution (MongoDB sessions)
- Live Portfolio Tracking
- Transaction History
- Leaderboard Rankings
- JWT Authentication
- Socket.IO Real-time Updates

## The Problem This Solves

Learning to trade crypto with real money is risky — one wrong trade and you lose thousands. Beginners need a way to understand how markets move, how portfolio value changes in real time, and how to think about buy/sell decisions — without any financial risk.

CryptoSim gives you a real trading experience:
- Live prices streamed directly from Coinbase, not mocked, not polled, not static
- Your portfolio value updates instantly as the market ticks, not on a delay
- Set a limit order and walk away — it executes automatically the moment the price hits, with the same atomicity guarantees as a market order
- Every trade decision has a consequence — your leaderboard rank changes in real time
- Reset your account anytime and start fresh with ₹1,00,000

---

## What it does

**Live Market Prices** — Dashboard shows real-time INR prices for BTC, ETH, SOL, DOGE, ADA, and XRP. Prices are streamed from Coinbase's public ticker WebSocket and broadcast to every connected client via Socket.IO the moment each tick arrives — no polling from the frontend, no fixed interval, no page refresh needed.

**Price History Chart** — Last 100 price ticks per coin stored in server memory. On connect, the server immediately sends the full history so the chart never loads empty. Switch between coins via dropdown to see each coin's recent movement.

**Market Orders (Buy/Sell)** — Trade any of the 6 coins instantly at the current live price. The backend reads the price from in-memory market state at the exact moment of the trade — not from the frontend request — so the price is always accurate and cannot be manipulated. Execution runs inside a MongoDB transaction shared with the limit-order engine, so market orders and limit orders go through identical, atomic trade logic.

**Limit Orders** — Place a pending order at a target price. Every incoming price tick triggers the order matcher, which checks all pending orders for that coin against the new price:
- BUY limit → executes when market price **falls to or below** target
- SELL limit → executes when market price **rises to or above** target

Each order is locked (`PENDING → PROCESSING`) before execution so a single order can never be matched twice by overlapping ticks. Orders page shows full list with status (PENDING / EXECUTED / CANCELLED), target price, and the actual executed price. Pending orders can be cancelled anytime.

**Portfolio with Live P&L** — Shows quantity held and average buy price per coin. Current value and profit/loss updates in real time as socket prices arrive.

**Trade History** — Every market order and executed limit order recorded as a transaction — coin, type, quantity, price at execution, and total amount.

**Leaderboard** — All users ranked by total net worth (wallet balance + current portfolio value at live prices across all 6 coins). Calculated dynamically on request.

**Account Reset** — Settings page lets users reset wallet back to ₹1,00,000, zero out all portfolio holdings, and clear transaction history. Useful for starting a fresh simulation.

**JWT Auth** — Register and login with email/password. JWT token passed to Socket.IO handshake so WebSocket connections are authenticated the same way as HTTP requests. Unauthenticated sockets are rejected before receiving any data.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React.js 19, React Router v7, Tailwind CSS v4, Vite |
| Backend | Node.js, Express.js v5 |
| Database | MongoDB, Mongoose (with multi-document transactions) |
| Real-time | Socket.IO (server + client), `ws` (Coinbase feed client) |
| Charts | Recharts (LineChart) |
| Market Data | Coinbase public ticker WebSocket (`ws-feed.exchange.coinbase.com`) |
| Auth | JWT, bcryptjs |
| HTTP Client | Axios |

---

## Architecture

### How live prices reach every user simultaneously

The backend holds a persistent WebSocket connection to Coinbase's public `ticker` channel for all 6 coins. Every tick updates an in-memory `marketState` object and a `marketHistory` array (last 100 ticks per coin), then broadcasts both to every connected socket client in a single emit.

```
[Coinbase ticker feed] ── push, per tick ──▶ coinbaseEngine.js
                                                   │
                                      ┌────────────┴────────────┐
                                marketState{}             marketHistory{}
                              (current prices)          (last 100 ticks)
                                      │
                            io.emit("marketUpdate", marketState)
                            io.emit("marketHistory", marketHistory)
                                      │
                         ┌────────────┴────────────┐
                    [User A]                  [User B]
                 setMarket(data)           setMarket(data)
```

When a new user connects, they immediately receive both via direct `socket.emit` — dashboard and chart never load empty. If the Coinbase connection drops, the engine reconnects automatically after 5 seconds.

### How the limit order engine works

Every incoming price tick for a coin triggers the order matcher for that coin before broadcasting:

```
Price tick for COIN arrives
    │
    ▼
Order.find({ coin: COIN, status: "PENDING" })
    │
For each pending order:
    │
    ├── Lock: findOneAndUpdate(status: PENDING → PROCESSING)
    │       → if another tick already locked it, skip
    │
    ├── Price condition met? (BUY: price <= target, SELL: price >= target)
    │       → no: unlock back to PENDING, wait for next tick
    │       → yes: continue
    │
    ▼
Open a MongoDB session, run inside session.withTransaction():
    │
    ├── BUY: atomically check + deduct wallet balance ($gte + $inc)
    │        atomically recompute weighted avgBuyPrice + quantity
    │        create Transaction record
    │
    └── SELL: atomically check + deduct portfolio quantity ($gte + $inc)
             atomically credit wallet balance
             create Transaction record
    │
    Mark order EXECUTED with executedPrice + executedAt
    │
    If any step throws → entire transaction rolls back, order unlocked to PENDING
    │
io.emit prices to all users
```

This runs on every price tick, not a fixed interval — there's no polling loop or cron job involved.

### How trades use server-side price, not frontend price

When a buy or sell request hits the backend, price is read from `marketState` at that moment — the request body price is never trusted:

```js
const currentPrice = marketState[coin]; // always from server memory
const cost = currentPrice * quantity;
```

This prevents any client from manipulating the price in the request body.

### How trade execution stays atomic under concurrency

Market orders (`tradeController.js`) and limit orders (`orderService.js`) both call the same underlying `executeBuy`/`executeSell` functions in `tradeService.js`, each wrapped in a MongoDB session transaction. Balance and holdings checks use conditional atomic updates instead of read-then-write:

```js
// Atomic check-and-deduct — Mongo applies the $gte filter and the $inc
// as a single indivisible operation, so two concurrent trades for the
// same user can never both pass the balance check before either deducts.
const user = await User.findOneAndUpdate(
  { _id: userId, walletBalance: { $gte: cost } },
  { $inc: { walletBalance: -cost } },
  { session, new: true }
);
```

If any step in a trade fails — insufficient balance, missing portfolio, insufficient holdings — the whole transaction aborts and rolls back automatically. No trade can leave the database in a half-applied state (e.g. wallet debited but coins never credited).

> **Requires a MongoDB replica set** for `session.withTransaction()` to work — MongoDB Atlas (including the free M0 tier) satisfies this by default. A plain standalone local `mongod` does not support transactions.

### How average buy price stays accurate

Each portfolio entry stores a running weighted average across all purchases, recomputed atomically on every BUY:

```js
const newAvgPrice =
  (oldQuantity * oldAvgPrice + quantity * currentPrice) / totalQuantity;
```

The same `executeBuy` function handles this for both market orders and auto-executed limit orders — there's a single source of truth for the calculation, not duplicated logic.

---

## Project structure

```
CryptoSim-main/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection + dotenv
│   ├── controllers/
│   │   ├── authController.js      # register (auto portfolio create), login, getMe
│   │   ├── tradeController.js     # buy, sell — server-side price, atomic via tradeService
│   │   ├── orderController.js     # placeOrder, getOrders, cancelOrder
│   │   ├── walletController.js    # resetWallet (balance + portfolio + history)
│   │   ├── portfolioController.js
│   │   ├── transactionController.js
│   │   └── leaderboardController.js
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification, req.user attach
│   ├── models/
│   │   ├── User.js                # name, email, password, walletBalance
│   │   ├── Portfolio.js           # per-coin { quantity, avgBuyPrice } — all 6 coins
│   │   ├── Transaction.js         # userId, coin, type, quantity, price, totalAmount
│   │   └── Order.js               # userId, coin, type, quantity, targetPrice, status, executedPrice, executedAt
│   ├── routes/                    # auth, trade, portfolio, transactions, leaderboard, orders, reset
│   ├── market/
│   │   ├── marketState.js         # in-memory price store + history arrays
│   │   └── coinbaseEngine.js      # Coinbase WebSocket feed + reconnect logic
│   ├── services/
│   │   ├── tradeService.js        # executeBuy / executeSell — atomic trade execution
│   │   └── orderService.js        # processOrders — order locking + matching, calls tradeService
│   └── server.js                  # Express + Socket.IO setup + JWT socket middleware
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Dashboard.jsx      # live prices + price change % + history chart
        │   ├── Portfolio.jsx      # holdings + avg buy price + live P&L
        │   ├── Buy.jsx            # market buy form
        │   ├── Sell.jsx           # market sell form
        │   ├── Orders.jsx         # limit orders list + cancel
        │   ├── History.jsx        # full transaction log
        │   ├── Leaderboard.jsx    # net worth rankings
        │   ├── Settings.jsx       # account reset + logout
        │   ├── Login.jsx
        │   └── Register.jsx
        ├── components/
        │   ├── Layout.jsx         # shared navbar + footer
        │   └── ProtectedRoute.jsx
        └── services/
            ├── api.js             # Axios instance with Bearer token header
            └── socket.js          # Socket.IO client with JWT handshake auth
```

---

## Running locally

**Prerequisites:** Node.js 18+, MongoDB Atlas (or a local replica set — transactions require one, a plain standalone `mongod` will not work)

```bash
git clone https://github.com/your-username/CryptoSim.git
cd CryptoSim
```

**Backend:**

```bash
cd backend
npm install
```

Create `backend/.env`:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_minimum_32_char_secret_here
CLIENT_URI=http://localhost:5173
```

```bash
npm run dev
```

**Frontend:**

```bash
cd ../frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

> Coinbase's ticker feed pushes continuously once connected — prices should appear within a few seconds of startup. Check the server console for "Connected to Coinbase"; if you see repeated disconnect/reconnect logs, your hosting provider's IP range may be rate-limited or blocked by Coinbase — this is more common on some free-tier cloud platforms.

---

## Key technical decisions

**Why Coinbase instead of Binance**
Binance's WebSocket API returns HTTP 451 (Unavailable For Legal Reasons) for connections from many cloud/datacenter IP ranges, including the ones used by Render and Railway — this is a deliberate exchange-side block tied to regulatory restrictions, not something fixable by retrying or changing regions. Coinbase's public market-data feed has no such restriction, since it's not subject to the same trading-jurisdiction rules for read-only price data.

**Why trade execution runs inside MongoDB transactions**
A single trade touches three things: wallet balance, portfolio holdings, and a transaction log entry. Without a transaction, a crash or concurrent write between those steps could leave the database half-updated — money deducted but coins never credited, for example. Wrapping execution in `session.withTransaction()` makes the whole trade atomic: either every write succeeds, or none of them do.

**Why balance and holdings checks use `$gte` + `$inc` instead of read-then-write**
Reading a balance into JavaScript, checking it, then saving a new value leaves a window where two concurrent requests can both read the same starting balance and both pass the check before either one saves — a classic lost-update race. Folding the check into the update itself (`findOneAndUpdate({ walletBalance: { $gte: cost } }, { $inc: { walletBalance: -cost } })`) makes Mongo perform the check-and-deduct as one indivisible operation.

**Why limit orders are locked before execution**
Without locking, two overlapping price ticks could both see the same `PENDING` order and try to execute it twice. Atomically flipping the order's status to `PROCESSING` before evaluating it means only one tick can ever claim a given order.

**Why average buy price is stored, not recalculated**
Recalculating from full transaction history on every portfolio view means scanning all past trades — gets slower as history grows. Maintaining a running weighted average in the Portfolio document keeps portfolio reads O(1) regardless of trade count.

**Why portfolio is auto-created on register**
If a new user tries to buy before creating a portfolio, the trade controller would crash on `portfolio[coin].quantity`. Auto-creating in the register controller ensures the trading flow works correctly from the very first login.

**Why Socket.IO instead of REST polling for prices**
REST polling requires every client to call an endpoint repeatedly — server load multiplies by connected users. With Socket.IO, a single incoming price tick updates all clients simultaneously with one `io.emit` call regardless of how many users are online.

---

## Known limitations / what's next
- Money calculations use native JavaScript floating-point numbers, not a decimal-safe library — acceptable for a simulator, but a real concern would warrant `decimal.js`
- No automated test suite yet
- No frontend input validation on buy/sell quantity — backend catches it but no inline error shown
- Socket reconnection on JWT expiry not handled — user needs to re-login manually
- No notification when a limit order executes — user has to check the Orders page manually
- Price change % on dashboard cards only shows change since last socket update, not 24h change

---

## Author

**Arbaz Ansari** — B.Tech CSE, 6th Semester

Built as a portfolio project to demonstrate real-time systems, WebSocket architecture, and atomic, transaction-safe order execution.

GitHub · LinkedIn
