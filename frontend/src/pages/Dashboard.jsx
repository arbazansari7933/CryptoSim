import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import socket from "../services/socket";
const Dashboard = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          CryptoSim Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-slate-900 p-6 rounded-xl">
          <h2>BTC</h2>
          <p className="text-3xl font-bold">
            ₹100000
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2>ETH</h2>
          <p className="text-3xl font-bold">
            ₹3000
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2>SOL</h2>
          <p className="text-3xl font-bold">
            ₹150
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;