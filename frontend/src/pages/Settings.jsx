import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] =
    useState(false);

  const handleReset = async () => {
    const confirmReset =
      window.confirm(
        "Are you sure? This will reset your wallet, portfolio, and transaction history."
      );

    if (!confirmReset) return;

    try {
      setLoading(true);

      const res = await api.post(
        "/auth/reset"
      );

      alert(res.data.message);

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Reset Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">
        Settings
      </h1>

      <div className="max-w-xl space-y-4">

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">
            Account Actions
          </h2>

          <p className="text-slate-400">
            Manage your CryptoSim account.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-red-400 text-xl mb-4">
            Danger Zone
          </h2>

          <button
            onClick={handleReset}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            {loading
              ? "Resetting..."
              : "Reset Account"}
          </button>

          <p className="text-sm text-slate-400 mt-2">
            Resets wallet balance,
            portfolio and transaction
            history.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;