import { useEffect, useState } from "react";
import api from "../services/api";
import { marketState } from "../../../backend/market/marketState";

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
        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-yellow-400 text-xl mb-3">
            BTC
          </h2>

          <p>
            Quantity: {portfolio?.BTC?.quantity}
          </p>

          <p>
            Avg Buy Price: ₹{portfolio?.BTC?.avgBuyPrice}
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-blue-400 text-xl mb-3">
            ETH
          </h2>

          <p>
            Quantity: {portfolio?.ETH?.quantity}
          </p>

          <p>
            Avg Buy Price: ₹{portfolio?.ETH?.avgBuyPrice}
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-green-400 text-xl mb-3">
            SOL
          </h2>

          <p>
            Quantity: {portfolio?.SOL?.quantity}
          </p>

          <p>
            Avg Buy Price: ₹{portfolio?.SOL?.avgBuyPrice}
          </p>
        </div>
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
            className={`text-2xl font-bold ${
                analytics.profitLoss >= 0
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