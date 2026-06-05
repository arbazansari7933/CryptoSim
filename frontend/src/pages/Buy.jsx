import { useState } from "react";
import api from "../services/api";

const Buy = () => {
  const [coin, setCoin] = useState("BTC");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  const handleBuy = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("auth/trade/buy", {
        coin,
        quantity: Number(quantity),
      });

      setMessage(res.data.message);
      setQuantity("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">
        Buy Coin
      </h1>

      <form
        onSubmit={handleBuy}
        className="max-w-md bg-slate-900 p-6 rounded-xl"
      >
        <label className="block mb-2">
          Coin
        </label>

        <select
          value={coin}
          onChange={(e) => setCoin(e.target.value)}
          className="w-full p-2 rounded text-white mb-4"
        >
          <option>BTC</option>
          <option>ETH</option>
          <option>SOL</option>
        </select>

        <label className="block mb-2">
          Quantity
        </label>

        <input
          type="number"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
          className="w-full p-2 rounded text-white mb-4"
        />

        <button
          type="submit"
          className="bg-green-600 px-4 py-2 rounded"
        >
          Buy
        </button>

        {message && (
          <p className="mt-4">{message}</p>
        )}
      </form>
    </div>
  );
};

export default Buy;