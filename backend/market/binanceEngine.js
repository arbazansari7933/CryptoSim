import WebSocket from "ws";
import { marketHistory, marketState } from "./marketState.js";
import { processOrders } from "../services/orderService.js";

const symbolMap = {
  btcusdt: "BTC",
  ethusdt: "ETH",
  solusdt: "SOL",
  dogeusdt: "DOGE",
  adausdt: "ADA",
  xrpusdt: "XRP",
};

export const startBinanceFeed = (io) => {
  const streams = [
    "btcusdt@ticker",
    "ethusdt@ticker",
    "solusdt@ticker",
    "dogeusdt@ticker",
    "adausdt@ticker",
    "xrpusdt@ticker",
  ].join("/");

  const ws = new WebSocket(
    `wss://stream.binance.com:9443/stream?streams=${streams}`
  );

  const USD_INR = 86; // Replace with live rate later

  ws.on("open", () => {
    console.log("Connected to Binance");
  });

  ws.on("message", async (data) => {
    try {
      const parsed = JSON.parse(data.toString());

      const stream = parsed.stream;
      const payload = parsed.data;

      if (!stream || !payload) return;

      const coin = symbolMap[stream.split("@")[0]];
      if (!coin) return;

      // Binance sends USDT price
      const usdtPrice = Number(payload.c);

      // Convert to INR
      const inrPrice = usdtPrice * USD_INR;

      marketState[coin] = inrPrice;
      await processOrders(
        coin,
        inrPrice
      );

      marketHistory[coin].push(inrPrice);

      if (marketHistory[coin].length > 100) {
        marketHistory[coin].shift();
      }

      //console.log(`${coin}: ₹${inrPrice.toFixed(2)}`);

      if (io) {
        io.emit("marketUpdate", marketState);
        io.emit("marketHistory", marketHistory);
      }
    } catch (err) {
      console.error("Parse Error:", err);
    }
  });

  ws.on("close", () => {
    console.log("Binance disconnected");
    setTimeout(() => {
      startBinanceFeed(io);
    }, 5000);
  });

  ws.on("error", (err) => {
    console.error("WebSocket Error:", err);
  });
};
