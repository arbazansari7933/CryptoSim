import { useNavigate, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { path: "/dashboard", label: "Market" },
  { path: "/portfolio", label: "Portfolio" },
  { path: "/buy", label: "Trade" },
  { path: "/history", label: "History" },
  { path: "/leaderboard", label: "Leaderboard" },
];

const Layout = ({ children, walletBalance }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {walletBalance !== undefined && (
              <span className="text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-md border border-white/5">
                ₹{Number(walletBalance).toLocaleString("en-IN")}
              </span>
            )}
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
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-400"
                }`}
              >
                {label}
              </button>
            );
          })}
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
          <span>Prices via CoinGecko · updates every 30s</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;