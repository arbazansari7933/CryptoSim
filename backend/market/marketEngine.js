import axios from "axios";
import { marketState } from "./marketState.js";
import { marketHistory } from "./marketState.js";
import Order from "../models/Order.js";
import Portfolio from "../models/Portfolio.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
const coinMap = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  DOGE: "dogecoin",
  ADA: "cardano",
  XRP: "ripple",
};
export const startMarketEngine = (io) => {
  const fetchPrices = async () => {
    try {
      const coinIds = Object.values(coinMap).join(",");
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price",
        {
          params: {
            ids: coinIds,
            vs_currencies: "inr",
          }
        }
      );
      for (const symbol in coinMap) {
        const coinId = coinMap[symbol];

        if (res.data[coinId]?.inr) {
          marketState[symbol] =
            res.data[coinId].inr;

          marketHistory[symbol].push(
            res.data[coinId].inr
          );

          if (
            marketHistory[symbol].length > 30
          ) {
            marketHistory[symbol].shift();
          }
        }
      }
      const pendingOrder = await Order.find({ status: "PENDING" });
      //console.log("Pending orders: ", pendingOrder);
      //console.log("BTC history:", marketHistory.BTC);
      for (const order of pendingOrder) {
        const currentprice = marketState[order.coin];
        if (order.type === "BUY" && currentprice <= order.targetPrice) {
          const user = await User.findById(order.userId);
          const cost = order.quantity * currentprice;
          const portfolio = await Portfolio.findOne({ userId: order.userId });
          if (!user || !portfolio) { continue; }
          if (user.walletBalance >= cost) {
            user.walletBalance -= cost;
            // portfolio[order.coin].quantity += order.quantity;
            const oldQuantity = portfolio[order.coin].quantity;
            const oldAvgPrice = portfolio[order.coin].avgBuyPrice;
            const totalQuantity = oldQuantity + order.quantity;
            const newAvgPrice = (oldQuantity * oldAvgPrice + order.quantity * currentprice) / totalQuantity;
            portfolio[order.coin].quantity = totalQuantity;
            portfolio[order.coin].avgBuyPrice = newAvgPrice;

            await user.save();
            await portfolio.save();
            await Transaction.create({
              userId: order.userId,
              coin: order.coin,
              type: "BUY",
              quantity: order.quantity,
              price: currentprice,
              totalAmount: cost,
            });
            console.log("BUY EXECUTED", order._id);
            order.status = "EXECUTED";
            order.executedPrice = currentprice;
            order.executedAt = new Date();
            await order.save();
          }
          else {
            console.log("Insufficient Balance");
          }

        }
        else if (order.type === "SELL" && currentprice >= order.targetPrice) {
          const user = await User.findById(order.userId);
          const portfolio = await Portfolio.findOne({ userId: order.userId });
          const cost = order.quantity * currentprice;
          if (!user || !portfolio) { continue; }
          if (portfolio[order.coin].quantity >= order.quantity) {
            user.walletBalance += cost;
            portfolio[order.coin].quantity -= order.quantity;
            if (portfolio[order.coin].quantity === 0) {
              portfolio[order.coin].avgBuyPrice = 0;
            }
            await user.save();
            await portfolio.save();
            await Transaction.create({
              userId: order.userId,
              coin: order.coin,
              type: "SELL",
              quantity: order.quantity,
              price: currentprice,
              totalAmount: cost,
            });
            console.log("SELL EXECUTED", order._id);
            order.status = "EXECUTED";
            order.executedPrice = currentprice;
            order.executedAt = new Date();
            await order.save();
            
          }
          else {
            console.log("Insufficient Coin");
          }
        }
      }
      io.emit("marketUpdate", marketState);
      io.emit("marketHistory", marketHistory);
    } catch (error) {

      console.log(
        "CoinGecko Error:",
        error.message
      );
    }
  }
  fetchPrices();

  setInterval(fetchPrices, 30000);
};