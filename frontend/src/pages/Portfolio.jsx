import { useEffect, useState } from "react";
import api from "../services/api";
import socket from "../services/socket";
const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    socket.on("marketUpdate", (data) => {
      setMarket(data);
    });

    return () => {
      socket.off("marketUpdate");
    };
  }, []);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get("auth/portfolio");

        setPortfolio(res.data.portfolio);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);
  useEffect(() => {
    if (!portfolio) return;

    let invested = 0;
    let currentValue = 0;

    Object.keys(market).forEach((coin) => {
      if (portfolio[coin]) {
        invested +=
          portfolio[coin].quantity *
          portfolio[coin].avgBuyPrice;

        currentValue +=
          portfolio[coin].quantity *
          market[coin];
      }
    });

    setAnalytics({
      portfolioValue: currentValue,
      investedValue: invested,
      profitLoss: currentValue - invested,
    });

  }, [market, portfolio]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading Portfolio...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">
        My Portfolio
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {Object.keys(market).map((coin) => (
          <div
            key={coin}
            className="bg-slate-900 p-6 rounded-xl"
          >
            <h2 className="text-xl mb-3">
              {coin}
            </h2>

            <p>
              Quantity: {portfolio?.[coin]?.quantity || 0}
            </p>

            <p>
              Avg Buy Price:
              ₹{portfolio?.[coin]?.avgBuyPrice || 0}
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

export default Portfolio;