import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const NAV_LINKS = [
  { path: "/dashboard", label: "Market" },
  { path: "/portfolio", label: "Portfolio" },
  { path: "/history", label: "History" },
  { path: "/orders", label: "Orders" },
  { path: "/leaderboard", label: "Leaderboard" },
];

const Layout = ({ children, walletBalance }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tradeOpen, setTradeOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isTradeActive =
    location.pathname === "/buy" || location.pathname === "/sell";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setTradeOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm font-semibold tracking-widest text-white uppercase"
          >
            Crypto<span className="text-emerald-400">Sim</span>
          </button>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ path, label }) => {
              const active = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                    active
                      ? "bg-white/10 text-white font-medium"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {label}
                </button>
              );
            })}

            {/* Trade dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setTradeOpen((o) => !o)}
                className={`flex items-center gap-1 px-4 py-1.5 rounded-md text-sm transition-all ${
                  isTradeActive || tradeOpen
                    ? "bg-white/10 text-white font-medium"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Trade
                <svg
                  className={`w-3 h-3 transition-transform ${tradeOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {tradeOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-36 bg-[#111118] border border-white/10 rounded-xl overflow-hidden shadow-xl">
                  <button
                    onClick={() => { navigate("/buy"); setTradeOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    Buy
                  </button>
                  <div className="border-t border-white/5" />
                  <button
                    onClick={() => { navigate("/sell"); setTradeOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    Sell
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {walletBalance !== undefined && (
              <span className="text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-md border border-white/5">
                ₹{Number(walletBalance).toLocaleString("en-IN")}
              </span>
            )}

            {/* Settings icon */}
            <button
              onClick={() => navigate("/settings")}
              title="Settings"
              className={`p-1.5 rounded-md transition-all ${
                location.pathname === "/settings"
                  ? "bg-white/10 text-white"
                  : "text-slate-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            <button
              onClick={logout}
              className="text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-white/5"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex gap-1 px-4 pb-2 overflow-x-auto">
          {NAV_LINKS.map(({ path, label }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`shrink-0 px-3 py-1 rounded text-xs transition-all ${
                  active ? "bg-white/10 text-white" : "text-slate-400"
                }`}
              >
                {label}
              </button>
            );
          })}
          <button
            onClick={() => navigate("/buy")}
            className={`shrink-0 px-3 py-1 rounded text-xs transition-all ${
              location.pathname === "/buy" ? "bg-white/10 text-white" : "text-slate-400"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => navigate("/sell")}
            className={`shrink-0 px-3 py-1 rounded text-xs transition-all ${
              location.pathname === "/sell" ? "bg-white/10 text-white" : "text-slate-400"
            }`}
          >
            Sell
          </button>
          <button
            onClick={() => navigate("/settings")}
            className={`shrink-0 px-3 py-1 rounded text-xs transition-all ${
              location.pathname === "/settings" ? "bg-white/10 text-white" : "text-slate-400"
            }`}
          >
            Settings
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-slate-600">
          <span>CryptoSim — virtual trading only, no real money</span>
          <span>Live prices via Binance WebSocket</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
