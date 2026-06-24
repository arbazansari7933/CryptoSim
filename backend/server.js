import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/authRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import { startCoinbaseFeed } from "./market/coinbaseEngine.js";
import { marketState } from "./market/marketState.js";
import resetRoutes from "./routes/resetRoutes.js";
//import socket from "./socket.js";
import { marketHistory } from "./market/marketState.js";
import orderRoutes from "./routes/orderRoutes.js";

//dotenv.config();
await connectDB();
const allowedOrigins = process.env.CLIENT_URI.split(",");

const app = express();
const server = http.createServer(app);
// console.log("CLIENT_URI =", process.env.CLIENT_URI);


const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});


app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/auth/portfolio", portfolioRoutes);
app.use("/api/auth/trade", tradeRoutes);
app.use("/api/auth/transactions", transactionRoutes);
app.use("/api/auth/leaderboard", leaderboardRoutes);
app.use( "/api/auth", resetRoutes );
app.use( "/api/auth/orders", orderRoutes );

app.get("/api", (req, res) => {
  res.send("Backend is running!");
});



io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const decoded = jwt.verify(
      token, process.env.JWT_SECRET
    );
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error("Authentication Failed"));
  }
})
const onlineUsers = {};
io.on("connection", (socket) => {
  // console.log("Socket Connected");
  // console.log(socket.user);
  const userId = socket.user.id;
  onlineUsers[userId] = socket.id;
  //  console.log(
  //     "Count =",
  //     Object.keys(onlineUsers).length
  //   );

  socket.on("disconnect", () => {
    // console.log(
    //     `${userId} disconnected`
    //   );

    delete onlineUsers[userId];
    // console.log("onlineUsers =", onlineUsers);

    //   console.log(
    //     "Count =",
    //     Object.keys(onlineUsers).length
    //   );

    // console.log("Online User :", onlineUsers.length);
  })
  socket.emit("marketUpdate", marketState);
  socket.emit("marketHistory", marketHistory);

});
startCoinbaseFeed(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/api`);
});