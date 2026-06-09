import { useState, useEffect } from "react";
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

const Buy = () => {
  const [coin, setCoin] = useState("BTC");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: "success"|"error", msg }
  const [market, setMarket] = useState(
    Object.fromEntries(COINS.map((c) => [c, 0]))
  );

  useEffect(() => {
    socket.on("marketUpdate", (data) => setMarket(data));
    return () => socket.off("marketUpdate");
  }, []);

  const estimatedTotal =
    quantity && market[coin]
      ? (parseFloat(quantity) * market[coin]).toLocaleString("en-IN", {
          maximumFractionDigits: 2,
        })
      : null;

  const handleBuy = async (e) => {
    e.preventDefault();
    if (!quantity || parseFloat(quantity) <= 0) {
      setStatus({ type: "error", msg: "Enter a valid quantity" });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await api.post("auth/trade/buy", {
        coin,
        quantity: parseFloat(quantity),
      });
      setStatus({ type: "success", msg: res.data.message });
      setQuantity("");
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-lg font-semibold text-white">Buy</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Orders execute at live server-side price
          </p>
        </div>

        {/* Form card */}
        <div className="bg-[#0f0f17] border border-white/5 rounded-2xl p-6 space-y-5">

          {/* Coin selector */}
          <div>
            <label className="text-xs text-slate-500 block mb-2">Coin</label>
            <div className="grid grid-cols-3 gap-2">
              {COINS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCoin(c)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all border ${
                    coin === c
                      ? "border-white/20 text-white"
                      : "border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10"
                  }`}
                  style={
                    coin === c
                      ? {
                          backgroundColor: COIN_COLORS[c] + "18",
                          color: COIN_COLORS[c],
                          borderColor: COIN_COLORS[c] + "40",
                        }
                      : {}
                  }
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Current price */}
          <div className="bg-white/3 rounded-lg px-4 py-3 flex justify-between items-center">
            <span className="text-xs text-slate-500">Current price</span>
            <span className="text-sm font-semibold text-white">
              ₹{Number(market[coin]).toLocaleString("en-IN")}
            </span>
          </div>

          {/* Quantity input */}
          <div>
            <label className="text-xs text-slate-500 block mb-2">Quantity</label>
            <input
              type="number"
              min="0.00001"
              step="0.00001"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white/5 border border-white/8 rounded-lg px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>

          {/* Estimated total */}
          {estimatedTotal && (
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Estimated total</span>
              <span className="text-white font-medium">≈ ₹{estimatedTotal}</span>
            </div>
          )}

          {/* Status message */}
          {status && (
            <div
              className={`text-xs px-4 py-3 rounded-lg ${
                status.type === "success"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {status.msg}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleBuy}
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 bg-emerald-500 hover:bg-emerald-400 text-black"
          >
            {loading ? "Processing..." : `Buy ${coin}`}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Buy;
