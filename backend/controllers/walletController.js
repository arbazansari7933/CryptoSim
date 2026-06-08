import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import Transaction from "../models/Transaction.js";
export const resetWallet = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const portfolio = await Portfolio.findOne({ userId: req.user._id });
        user.walletBalance = 100000;
        await user.save();

        const coins = ["BTC", "ETH", "SOL", "DOGE", "ADA", "XRP"];

        coins.forEach((coin) => {
            portfolio[coin].quantity = 0;
            portfolio[coin].avgBuyPrice = 0;
        });
        await portfolio.save();

        await Transaction.deleteMany({
            userId: req.user._id,
        })
        res.json({
            message:
                "Account reset successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}