import {
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Buy from "./pages/Buy";
import Sell from "./pages/Sell";
import History from "./pages/History";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
      <Routes> <Route path="/" element={<Login />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
      <Route path="/portfolio" element={<ProtectedRoute> <Portfolio /> </ProtectedRoute>} />
      <Route path="/buy" element={<ProtectedRoute><Buy /></ProtectedRoute>} />
      <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
      <Route path="/history" element={ <ProtectedRoute> <History /> </ProtectedRoute> } />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/orders" element={ <ProtectedRoute> <Orders /> </ProtectedRoute> } />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /></Routes>
      
  );
}

export default App;