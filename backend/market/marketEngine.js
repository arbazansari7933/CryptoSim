import { marketState } from "./marketState.js";

const getRandomChange = () =>
  Math.floor(Math.random() * 21) - 10;

export const startMarketEngine = (io) => {
  setInterval(() => {
    marketState.BTC += getRandomChange();
    marketState.ETH += getRandomChange();
    marketState.SOL += getRandomChange();

    io.emit("marketUpdate", marketState);
  }, 1000);
};