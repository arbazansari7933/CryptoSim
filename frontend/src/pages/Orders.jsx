import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coin, setCoin] = useState("BTC");
const [type, setType] = useState("BUY");
const [quantity, setQuantity] = useState("");
const [targetPrice, setTargetPrice] = useState("");
const [message, setMessage] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await api.get("/auth/orders");
      setOrders(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  
  const cancelOrder = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;
    try {
      await api.patch(`/auth/orders/${id}/cancel`);
      fetchOrders();
    } catch (error) {
      console.log(error);
      alert("Failed to cancel order");
    }
  };

  const placeOrder = async (e) => {
  e.preventDefault();

  try {
    await api.post("/auth/orders", {
      coin,
      type,
      quantity: Number(quantity),
      targetPrice: Number(targetPrice),
    });

    setMessage("Order placed successfully");

    setCoin("BTC");
    setType("BUY");
    setQuantity("");
    setTargetPrice("");

    fetchOrders();
  } catch (error) {
    console.log(error);
    setMessage("Failed to place order");
  }
};

  const statusStyles = {
    PENDING: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    EXECUTED: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    CANCELLED: "bg-red-500/10 text-red-400 border border-red-500/20",
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
          Loading orders...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Create Order */}
<div className="bg-[#0f0f17] border border-white/5 rounded-2xl p-5 mb-6">
  <h2 className="text-sm font-semibold text-white mb-4">
    Create Limit Order
  </h2>

  <form
    onSubmit={placeOrder}
    className="grid md:grid-cols-5 gap-3"
  >
    <select
      value={coin}
      onChange={(e) =>
        setCoin(e.target.value)
      }
      className="bg-[#151520] border border-white/5 rounded-lg px-3 py-2 text-sm"
    >
      <option>BTC</option>
      <option>ETH</option>
      <option>SOL</option>
      <option>DOGE</option>
      <option>ADA</option>
      <option>XRP</option>
    </select>

    <select
      value={type}
      onChange={(e) =>
        setType(e.target.value)
      }
      className="bg-[#151520] border border-white/5 rounded-lg px-3 py-2 text-sm"
    >
      <option value="BUY">BUY</option>
      <option value="SELL">SELL</option>
    </select>

    <input
      type="number"
      step="0.0001"
      placeholder="Quantity"
      value={quantity}
      onChange={(e) =>
        setQuantity(e.target.value)
      }
      className="bg-[#151520] border border-white/5 rounded-lg px-3 py-2 text-sm"
      required
    />

    <input
      type="number"
      placeholder="Target Price"
      value={targetPrice}
      onChange={(e) =>
        setTargetPrice(e.target.value)
      }
      className="bg-[#151520] border border-white/5 rounded-lg px-3 py-2 text-sm"
      required
    />

    <button
      type="submit"
      className="bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium"
    >
      Place Order
    </button>
  </form>

  {message && (
    <p className="text-xs text-slate-400 mt-3">
      {message}
    </p>
  )}
</div>
<div className="grid grid-cols-3 gap-4 mb-6">
  <div className="bg-[#0f0f17] border border-white/5 rounded-xl p-4">
    <p className="text-slate-500 text-xs">
      Pending
    </p>
    <p className="text-xl font-semibold">
      {
        orders.filter(
          (o) => o.status === "PENDING"
        ).length
      }
    </p>
  </div>

  <div className="bg-[#0f0f17] border border-white/5 rounded-xl p-4">
    <p className="text-slate-500 text-xs">
      Executed
    </p>
    <p className="text-xl font-semibold text-emerald-400">
      {
        orders.filter(
          (o) => o.status === "EXECUTED"
        ).length
      }
    </p>
  </div>

  <div className="bg-[#0f0f17] border border-white/5 rounded-xl p-4">
    <p className="text-slate-500 text-xs">
      Cancelled
    </p>
    <p className="text-xl font-semibold text-red-400">
      {
        orders.filter(
          (o) => o.status === "CANCELLED"
        ).length
      }
    </p>
  </div>
</div>
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-white">Orders</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[#0f0f17] border border-white/5 rounded-xl p-10 text-center text-slate-600 text-sm">
          No orders yet. Place a limit order to see it here.
        </div>
      ) : (
        <div className="bg-[#0f0f17] border border-white/5 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-7 px-5 py-3 border-b border-white/5">
            {["Coin", "Type", "Qty", "Target", "Status", "Executed", ""].map(
              (h) => (
                <span
                  key={h}
                  className="text-xs text-slate-500 font-medium"
                >
                  {h}
                </span>
              )
            )}
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="grid grid-cols-7 px-5 py-3.5 hover:bg-white/2 transition-colors items-center"
              >
                {/* Coin */}
                <span className="text-sm font-semibold text-white">
                  {order.coin}
                </span>

                {/* Type */}
                <span
                  className={`text-xs font-semibold ${
                    order.type === "BUY"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {order.type}
                </span>

                {/* Qty */}
                <span className="text-sm text-slate-300">
                  {order.quantity}
                </span>

                {/* Target price */}
                <span className="text-sm text-slate-300">
                  ₹{Number(order.targetPrice).toLocaleString("en-IN")}
                </span>

                {/* Status badge */}
                <span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                      statusStyles[order.status] ||
                      "bg-white/5 text-slate-400"
                    }`}
                  >
                    {order.status}
                  </span>
                </span>

                {/* Executed price */}
                <span className="text-sm text-slate-300">
                  {order.executedPrice
                    ? `₹${Number(order.executedPrice).toLocaleString(
                        "en-IN"
                      )}`
                    : "—"}
                </span>

                {/* Cancel action */}
                <span>
                  {order.status === "PENDING" ? (
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="text-xs text-red-400 border border-red-500/20 px-3 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      Cancel
                    </button>
                  ) : (
                    <span className="text-slate-600 text-sm">—</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Orders;
