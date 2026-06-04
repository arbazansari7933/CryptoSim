import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import socket from "../services/socket";
const Dashboard = () => {
    const navigate = useNavigate();
    const [market, setMarket] = useState({
        BTC: 0,
        ETH: 0,
        SOL: 0,
    });

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };
    useEffect(() => {
        socket.on("connect", () => {
            console.log("Frontend Connected");
        });

        return () => {
            socket.off("connect");
        };
    }, []);

    useEffect(() => {
      socket.on("marketUpdate", (data)=>{
        //console.log(data);
        setMarket(data);
        
      })
    
      return () => {
        socket.off("marketUpdate");
      }
    }, [])
    


return (
  <div className="min-h-screen bg-slate-950 text-white p-6">

    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">
        CryptoSim Dashboard
      </h1>

      <div className="flex gap-3">
        <button
          onClick={() => navigate("/portfolio")}
          className="bg-slate-800 px-4 py-2 rounded-lg"
        >
          Portfolio
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
    <h2 className="text-xl font-semibold mb-4">
      Live Market
    </h2>

    <div className="grid md:grid-cols-3 gap-6">

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <h3 className="text-yellow-400 font-semibold">
          Bitcoin (BTC)
        </h3>

        <p className="text-3xl font-bold mt-3">
          ₹ {market.BTC}
        </p>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <h3 className="text-blue-400 font-semibold">
          Ethereum (ETH)
        </h3>

        <p className="text-3xl font-bold mt-3">
          ₹ {market.ETH}
        </p>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <h3 className="text-green-400 font-semibold">
          Solana (SOL)
        </h3>

        <p className="text-3xl font-bold mt-3">
          ₹ {market.SOL}
        </p>
      </div>

    </div>
  </div>
);
};

export default Dashboard;