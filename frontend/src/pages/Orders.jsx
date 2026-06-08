import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get(
        "/auth/orders"
      );

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
    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel this order?"
      );

    if (!confirmCancel) return;

    try {
      await api.patch(
        `/auth/orders/${id}/cancel`
      );

      fetchOrders();
    } catch (error) {
      console.log(error);
      alert("Failed to cancel order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          My Orders
        </h1>

        <button
          onClick={() =>
            navigate("/dashboard")
          }
          className="bg-slate-800 px-4 py-2 rounded-lg"
        >
          Back
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">

        <div className="overflow-x-auto">
          <table className="w-full">

            <thead className="bg-slate-800">
              <tr>
                <th className="text-left p-4">
                  Coin
                </th>

                <th className="text-left p-4">
                  Type
                </th>

                <th className="text-left p-4">
                  Quantity
                </th>

                <th className="text-left p-4">
                  Target Price
                </th>

                <th className="text-left p-4">
                  Status
                </th>

                <th className="text-left p-4">
                  Executed Price
                </th>

                <th className="text-left p-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-slate-400"
                  >
                    No Orders Found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t border-slate-800"
                  >
                    <td className="p-4">
                      {order.coin}
                    </td>

                    <td
                      className={`p-4 font-semibold ${
                        order.type === "BUY"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {order.type}
                    </td>

                    <td className="p-4">
                      {order.quantity}
                    </td>

                    <td className="p-4">
                      ₹
                      {Number(
                        order.targetPrice
                      ).toLocaleString()}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          order.status ===
                          "PENDING"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : order.status ===
                              "EXECUTED"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="p-4">
                      {order.executedPrice
                        ? `₹${Number(
                            order.executedPrice
                          ).toLocaleString()}`
                        : "-"}
                    </td>

                    <td className="p-4">
                      {order.status ===
                      "PENDING" ? (
                        <button
                          onClick={() =>
                            cancelOrder(
                              order._id
                            )
                          }
                          className="bg-red-600 px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;