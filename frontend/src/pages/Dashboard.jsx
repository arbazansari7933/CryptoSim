import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import socket from "../services/socket";
import api from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [market, setMarket] = useState({
    BTC: 0,
    ETH: 0,
    SOL: 0,
    DOGE: 0,
    ADA: 0,
    XRP: 0,
  });
  const [analytics, setAnalytics] = useState({
    portfolioValue: 0,
    investedValue: 0,
    profitLoss: 0,
  });

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Frontend Connected");
    });

    socket.on("marketUpdate", (data) => {
      setMarket(data);
    });

    return () => {
      socket.off("connect");
      socket.off("marketUpdate");
    };
  }, []);
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const res = await api.get("auth/portfolio");
      setPortfolio(res.data.portfolio);
    };

    fetchPortfolio();
  }, []);

  useEffect(() => {
    if (!portfolio) return;
    let invested = 0;
    let currentValue = 0;
    invested += portfolio.BTC.quantity * portfolio.BTC.avgBuyPrice;
    invested += portfolio.ETH.quantity * portfolio.ETH.avgBuyPrice;
    invested += portfolio.SOL.quantity * portfolio.SOL.avgBuyPrice;

    currentValue += portfolio.BTC.quantity * market.BTC;
    currentValue += portfolio.ETH.quantity * market.ETH;
    currentValue += portfolio.SOL.quantity * market.SOL;

    setAnalytics({
      portfolioValue: currentValue,
      investedValue: invested,
      profitLoss: currentValue - invested
    })
  }, [market, portfolio])


  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          CryptoSim Dashboard
        </h1>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate("/portfolio")}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            Portfolio
          </button>

          <button
            onClick={() => navigate("/buy")}
            className="bg-green-600 px-4 py-2 rounded-lg"
          >
            Buy
          </button>

          <button
            onClick={() => navigate("/sell")}
            className="bg-yellow-600 px-4 py-2 rounded-lg"
          >
            Sell
          </button>

          <button
            onClick={() => navigate("/history")}
            className="bg-purple-600 px-4 py-2 rounded-lg"
          >
            History
          </button>
          <button
            onClick={() => navigate("/leaderboard")}
            className="bg-yellow-500 text-black px-4 py-2 rounded"
          >
            Leaderboard
          </button>

          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Market */}
      <h2 className="text-2xl font-semibold mb-4">
        Live Market
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {Object.entries(market).map(([coin, price]) => (
          <div
            key={coin}
            className="bg-slate-900 p-5 rounded-xl border border-slate-800"
          >
            <p className="text-slate-400 text-sm">
              {coin}
            </p>

            <p className="text-2xl font-bold mt-2">
              ₹ {Number(price).toLocaleString()}
            </p>
          </div>
        ))}

      </div>
      <div className="grid md:grid-cols-3 gap-6 mt-8">

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2>Portfolio Value</h2>
          <p className="text-2xl font-bold">
            ₹{analytics.portfolioValue.toFixed(2)}
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2>Invested Value</h2>
          <p className="text-2xl font-bold">
            ₹{analytics.investedValue.toFixed(2)}
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2>Profit / Loss</h2>

          <p
            className={`text-2xl font-bold ${analytics.profitLoss >= 0
                ? "text-green-500"
                : "text-red-500"
              }`}
          >
            ₹{analytics.profitLoss.toFixed(2)}
          </p>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;