import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import socket from "../services/socket";
import Layout from "../components/Layout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COINS = ["BTC", "ETH", "SOL", "DOGE", "ADA", "XRP"];

const COIN_COLORS = {
  BTC: "#f7931a",
  ETH: "#627eea",
  SOL: "#9945ff",
  DOGE: "#c2a633",
  ADA: "#0033ad",
  XRP: "#346aa9",
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111118] border border-white/10 px-3 py-2 rounded-lg text-xs">
        <p className="text-slate-400">Price</p>
        <p className="text-white font-semibold">
          ₹{Number(payload[0].value).toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [market, setMarket] = useState(
    Object.fromEntries(COINS.map((c) => [c, 0]))
  );
  const [priceHistory, setPriceHistory] = useState(
    Object.fromEntries(COINS.map((c) => [c, []]))
  );
  const [prevMarket, setPrevMarket] = useState({});
  const [selectedCoin, setSelectedCoin] = useState("BTC");

  useEffect(() => {
    socket.on("marketUpdate", (data) => {
      setMarket((curr) => {
        setPrevMarket(curr);
        return data;
      });
    });
    socket.on("marketHistory", (data) => {
      setPriceHistory(data);
    });
    return () => {
      socket.off("marketUpdate");
      socket.off("marketHistory");
    };
  }, []);

  const chartData = (priceHistory?.[selectedCoin] || []).map(
    (price, index) => ({ time: index + 1, price })
  );

  const getChange = (coin) => {
    if (!prevMarket[coin] || prevMarket[coin] === 0) return null;
    return (
      ((market[coin] - prevMarket[coin]) / prevMarket[coin]) *
      100
    ).toFixed(2);
  };

  return (
    <Layout>
      {/* Section: Live Market */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-semibold text-white">Live Market</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time market data
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Live
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {COINS.map((coin) => {
            const change = getChange(coin);
            const isUp = change !== null && parseFloat(change) >= 0;
            const isDown = change !== null && parseFloat(change) < 0;

            return (
              <button
                key={coin}
                onClick={() => setSelectedCoin(coin)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selectedCoin === coin
                    ? "bg-white/5 border-white/20"
                    : "bg-[#0f0f17] border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: COIN_COLORS[coin] + "22",
                      color: COIN_COLORS[coin],
                    }}
                  >
                    {coin}
                  </span>
                  {change !== null && (
                    <span
                      className={`text-xs font-medium ${
                        isUp ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {isUp ? "▲" : "▼"} {Math.abs(change)}%
                    </span>
                  )}
                </div>
                <p className="text-lg font-bold text-white mt-1">
                  ₹{Number(market[coin]).toLocaleString("en-IN")}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section: Chart */}
      <div className="bg-[#0f0f17] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Price History
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Last {chartData.length} snapshots
            </p>
          </div>

          {/* Coin selector */}
          <div className="flex gap-1">
            {COINS.map((coin) => (
              <button
                key={coin}
                onClick={() => setSelectedCoin(coin)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  selectedCoin === coin
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                style={
                  selectedCoin === coin
                    ? {
                        backgroundColor: COIN_COLORS[coin] + "30",
                        color: COIN_COLORS[coin],
                      }
                    : {}
                }
              >
                {coin}
              </button>
            ))}
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-600 text-sm">
            Waiting for price data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <XAxis
                dataKey="time"
                tick={{ fill: "#475569", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#475569", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  "₹" + Number(v).toLocaleString("en-IN")
                }
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={COIN_COLORS[selectedCoin]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: COIN_COLORS[selectedCoin] }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
