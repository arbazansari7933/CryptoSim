import { useEffect, useState } from "react";
import api from "../services/api";

const History = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("auth/transactions");
        setTransactions(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Transaction History
      </h1>

      <div className="bg-slate-900 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Coin</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx._id}
                className="border-t border-slate-700"
              >
                <td
                  className={`p-3 ${
                    tx.type === "BUY"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {tx.type}
                </td>

                <td className="p-3">{tx.coin}</td>

                <td className="p-3">
                  {tx.quantity}
                </td>

                <td className="p-3">
                  ₹{tx.price}
                </td>

                <td className="p-3">
                  ₹{tx.totalAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;