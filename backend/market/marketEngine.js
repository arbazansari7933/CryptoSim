import axios from "axios";
import { marketState } from "./marketState.js";

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
        }
      }
      console.log("Update Prices: ");
      console.log(marketState);
      io.emit("marketUpdate", marketState);
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