import WebSocket from "ws";
import { marketHistory, marketState } from "./marketState.js";
import { processOrders } from "../services/orderService.js";

const symbolMap = {
  "BTC-USD": "BTC",
  "ETH-USD": "ETH",
  "SOL-USD": "SOL",
  "DOGE-USD": "DOGE",
  "ADA-USD": "ADA",
  "XRP-USD": "XRP",
};

export const startCoinbaseFeed = (io) => {
  const ws = new WebSocket(
    "wss://ws-feed.exchange.coinbase.com"
  );

  const USD_INR = 86;

  ws.on("open", () => {
    console.log("Connected to Coinbase");

    ws.send(
      JSON.stringify({
        type: "subscribe",
        product_ids: [
          "BTC-USD",
          "ETH-USD",
          "SOL-USD",
          "DOGE-USD",
          "ADA-USD",
          "XRP-USD",
        ],
        channels: ["ticker"],
      })
    );
  });

  ws.on("message", async (data) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.type !== "ticker") return;

      const coin = symbolMap[msg.product_id];

      if (!coin) return;

      const usdPrice = Number(msg.price);

      const inrPrice = usdPrice * USD_INR;

      marketState[coin] = inrPrice;

      await processOrders( coin, inrPrice );

      marketHistory[coin].push( inrPrice );

      if ( marketHistory[coin].length > 100 ) {
        marketHistory[coin].shift();
      }

      if (io) {
        io.emit( "marketUpdate", marketState );

        io.emit( "marketHistory", marketHistory );
      }
    } catch (err) {
      console.error( "Coinbase Parse Error:", err );
    }
  });

  ws.on("close", () => {
    console.log( "Coinbase disconnected" );

    setTimeout(() => {
      startCoinbaseFeed(io);
    }, 5000);
  });

  ws.on("error", (err) => {
    console.error( "Coinbase WebSocket Error:", err );
  });
};