// ─── Leaderboard.jsx ─────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

export const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const myId = JSON.parse(localStorage.getItem("user") || "{}")?.id;

  useEffect(() => {
    api
      .get("auth/leaderboard")
      .then((res) => setLeaders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
          Loading leaderboard...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-white">Leaderboard</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Ranked by total net worth at live prices
        </p>
      </div>

      <div className="space-y-2">
        {leaders.map((user, index) => {
          const isMe = user._id === myId;
          return (
            <div
              key={index}
              className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all ${
                isMe
                  ? "bg-white/5 border-white/15"
                  : "bg-[#0f0f17] border-white/5"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-lg w-6 text-center">
                  {index < 3 ? medals[index] : (
                    <span className="text-slate-600 text-sm">
                      #{index + 1}
                    </span>
                  )}
                </span>
                <div>
                  <p className={`text-sm font-medium ${isMe ? "text-white" : "text-slate-300"}`}>
                    {user.name}
                    {isMe && (
                      <span className="ml-2 text-xs text-slate-500">(you)</span>
                    )}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-white">
                ₹{Number(user.totalValue).toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default Leaderboard;
