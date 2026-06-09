import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    const confirmReset = window.confirm(
      "Are you sure? This will reset your wallet, portfolio, and transaction history."
    );
    if (!confirmReset) return;
    try {
      setLoading(true);
      const res = await api.post("/auth/reset");
      alert(res.data.message);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Reset Failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-white">Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your account
        </p>
      </div>

      <div className="max-w-lg space-y-3">
        {/* Account section */}
        <div className="bg-[#0f0f17] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/5">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Account
            </p>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Sign out</p>
              <p className="text-xs text-slate-500 mt-0.5">
                You will be returned to the login page
              </p>
            </div>
            <button
              onClick={logout}
              className="text-sm text-slate-300 border border-white/10 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-[#0f0f17] border border-red-500/15 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-red-500/15">
            <p className="text-xs font-medium text-red-400/70 uppercase tracking-wider">
              Danger Zone
            </p>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Reset account</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Clears your wallet, portfolio, and all transaction history.
                Cannot be undone.
              </p>
            </div>
            <button
              onClick={handleReset}
              disabled={loading}
              className="text-sm text-red-400 border border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50 shrink-0 ml-6"
            >
              {loading ? "Resetting..." : "Reset"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
