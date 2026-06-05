import Transaction from "../models/Transaction.js";

export const getTransactions = async (req,res) => {
  try {
    const transactions =
      await Transaction.find({
        userId: req.user._id,
      }).sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};