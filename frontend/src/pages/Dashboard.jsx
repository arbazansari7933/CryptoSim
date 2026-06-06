import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import socket from "../services/socket";
import api from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
  const [priceHistory, setPriceHistory] = useState({
  BTC: [],
  ETH: [],
  SOL: [],
  DOGE: [],
  ADA: [],
  XRP: [],
});
const [selectedCoin, setSelectedCoin] =
  useState("BTC");
 

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
      setPriceHistory((prev)=>{
        const updated={...prev};
        Object.keys(data).forEach((coin)=>{
          updated[coin]=[...updated[coin], data[coin]];
          if(updated[coin].length>20){
            updated[coin].shift();
          }
        });
        return updated;
      })
    });


    return () => {
      socket.off("connect");
      socket.off("marketUpdate");
    };
  }, []);
  const chartData=priceHistory[selectedCoin].map(
    (price, index)=>({
      time:index+1,
      price,
    })
  )

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
      <select
  value={selectedCoin}
  onChange={(e) =>
    setSelectedCoin(e.target.value)
  }
  className="bg-slate-900 p-2 rounded mt-8 mb-4"
>
  {Object.keys(market).map((coin) => (
    <option key={coin}>
      {coin}
    </option>
  ))}
</select>

<div className="mt-6 bg-slate-900 p-6 rounded-xl">
  <h2 className="text-2xl font-bold mb-4">
    {selectedCoin} Price History
  </h2>

  <ResponsiveContainer
    width="100%"
    height={300}
  >
    <LineChart data={chartData}>
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />

      <Line
        type="monotone"
        dataKey="price"
        stroke="#22c55e"
      />
    </LineChart>
  </ResponsiveContainer>
</div>

    </div>
  );
};

export default Dashboard;