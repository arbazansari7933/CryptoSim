import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("auth/transactions")
      .then((res) => setTransactions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
          Loading history...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-white">Trade History</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-[#0f0f17] border border-white/5 rounded-xl p-10 text-center text-slate-600 text-sm">
          No trades yet. Buy or sell a coin to see history here.
        </div>
      ) : (
        <div className="bg-[#0f0f17] border border-white/5 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-5 px-5 py-3 border-b border-white/5">
            {["Type", "Coin", "Qty", "Price", "Total"].map((h) => (
              <span key={h} className="text-xs text-slate-500 font-medium">
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <div
                key={tx._id}
                className="grid grid-cols-5 px-5 py-3.5 hover:bg-white/2 transition-colors"
              >
                <span
                  className={`text-xs font-semibold ${
                    tx.type === "BUY" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {tx.type}
                </span>
                <span className="text-xs text-white">{tx.coin}</span>
                <span className="text-xs text-slate-300">{tx.quantity}</span>
                <span className="text-xs text-slate-300">
                  ₹{Number(tx.price).toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-white font-medium">
                  ₹{Number(tx.totalAmount).toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default History;
