import { useEffect, useState } from "react";
import api from "../services/api";
import socket from "../services/socket";
import Layout from "../components/Layout";

const COINS = ["BTC", "ETH", "SOL", "DOGE", "ADA", "XRP"];

const COIN_COLORS = {
  BTC: "#f7931a",
  ETH: "#627eea",
  SOL: "#9945ff",
  DOGE: "#c2a633",
  ADA: "#0033ad",
  XRP: "#346aa9",
};

const StatCard = ({ label, value, sub, highlight }) => (
  <div className="bg-[#0f0f17] border border-white/5 rounded-xl p-5">
    <p className="text-xs text-slate-500 mb-2">{label}</p>
    <p
      className={`text-2xl font-bold ${
        highlight === "green"
          ? "text-emerald-400"
          : highlight === "red"
          ? "text-red-400"
          : "text-white"
      }`}
    >
      {value}
    </p>
    {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
  </div>
);

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [market, setMarket] = useState(
    Object.fromEntries(COINS.map((c) => [c, 0]))
  );
  const [analytics, setAnalytics] = useState({
    portfolioValue: 0,
    investedValue: 0,
    profitLoss: 0,
  });

  useEffect(() => {
    socket.on("marketUpdate", (data) => setMarket(data));
    return () => socket.off("marketUpdate");
  }, []);

  useEffect(() => {
    api
      .get("auth/portfolio")
      .then((res) => setPortfolio(res.data.portfolio))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!portfolio) return;
    let invested = 0;
    let currentValue = 0;
    COINS.forEach((coin) => {
      if (portfolio[coin]) {
        invested += portfolio[coin].quantity * portfolio[coin].avgBuyPrice;
        currentValue += portfolio[coin].quantity * market[coin];
      }
    });
    setAnalytics({
      portfolioValue: currentValue,
      investedValue: invested,
      profitLoss: currentValue - invested,
    });
  }, [market, portfolio]);

  const heldCoins = portfolio
    ? COINS.filter((c) => portfolio[c]?.quantity > 0)
    : [];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
          Loading portfolio...
        </div>
      </Layout>
    );
  }

  const pnlPercent =
    analytics.investedValue > 0
      ? ((analytics.profitLoss / analytics.investedValue) * 100).toFixed(2)
      : "0.00";

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-white">Portfolio</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Live P&amp;L updates every 30 seconds
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
        <StatCard
          label="Portfolio Value"
          value={`₹${analytics.portfolioValue.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}`}
        />
        <StatCard
          label="Invested"
          value={`₹${analytics.investedValue.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}`}
        />
        <StatCard
          label="Total P&L"
          value={`${analytics.profitLoss >= 0 ? "+" : ""}₹${analytics.profitLoss.toLocaleString(
            "en-IN",
            { maximumFractionDigits: 2 }
          )}`}
          sub={`${pnlPercent}% overall`}
          highlight={analytics.profitLoss >= 0 ? "green" : "red"}
        />
      </div>

      {/* Holdings */}
      <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
        Holdings
      </h2>

      {heldCoins.length === 0 ? (
        <div className="bg-[#0f0f17] border border-white/5 rounded-xl p-10 text-center text-slate-600 text-sm">
          No holdings yet. Buy some coins to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {heldCoins.map((coin) => {
            const qty = portfolio[coin].quantity;
            const avg = portfolio[coin].avgBuyPrice;
            const currentPrice = market[coin];
            const currentVal = qty * currentPrice;
            const invested = qty * avg;
            const pnl = currentVal - invested;
            const pnlPct =
              invested > 0 ? ((pnl / invested) * 100).toFixed(2) : "0.00";

            return (
              <div
                key={coin}
                className="bg-[#0f0f17] border border-white/5 rounded-xl px-5 py-4 flex items-center justify-between"
              >
                {/* Left: coin name */}
                <div className="flex items-center gap-3 w-24">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: COIN_COLORS[coin] }}
                  />
                  <span className="text-sm font-semibold text-white">
                    {coin}
                  </span>
                </div>

                {/* Qty + avg */}
                <div className="hidden md:block text-xs text-slate-500">
                  <span className="text-white">{qty}</span> units &nbsp;·&nbsp;
                  avg ₹{Number(avg).toLocaleString("en-IN")}
                </div>

                {/* Current value */}
                <div className="text-sm text-white font-medium">
                  ₹{currentVal.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </div>

                {/* P&L */}
                <div
                  className={`text-sm font-semibold ${
                    pnl >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {pnl >= 0 ? "+" : ""}
                  {pnlPct}%
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* All coins table (zero holdings too) */}
      {heldCoins.length > 0 && heldCoins.length < COINS.length && (
        <p className="text-xs text-slate-600 mt-4">
          {COINS.length - heldCoins.length} coins with no holdings hidden
        </p>
      )}
    </Layout>
  );
};

export default Portfolio;
