import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    coin: {
      type: String,
      enum: [
        "BTC",
        "ETH",
        "SOL",
        "DOGE",
        "ADA",
        "XRP",
      ],
      required: true,
    },

    type: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0.0001,
    },

    targetPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "EXECUTED",
        "PROCESSING",
        "CANCELLED",
      ],
      default: "PENDING",
    },

    executedPrice: {
      type: Number,
      default: null,
    },

    executedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Order",
  orderSchema
);