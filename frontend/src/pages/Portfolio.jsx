import { useEffect, useState } from "react";
import api from "../services/api";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

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
 console.log(portfolio);
 
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
    </div>
  );
};

export default Portfolio;