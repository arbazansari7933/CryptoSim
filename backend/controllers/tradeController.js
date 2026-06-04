import { marketState } from "../market/marketState.js";
import Portfolio from "../models/Portfolio.js";
import User from "../models/User.js";


export const buyCoin = async (req, res) => {

    try {
        const { coin, quantity } = req.body;

        if (quantity <= 0)
            return res.status(400).json({
                message: "Invalid Quantity",
            });

        const currentPrice = marketState[coin];

        const costToBuy = currentPrice * quantity;

        const user = await User.findById(req.user._id);
        if ((user.walletBalance) < costToBuy) {
            return res.status(401).json({
                message: "Insufficient Balance"
            })
        }
        user.walletBalance -= costToBuy;

        const portfolio = await Portfolio.findOne({ userId: req.user._id });
        const oldQuantity = portfolio[coin].quantity;
        const oldAvgPrice = portfolio[coin].avgBuyPrice;

        const totalQuantity = oldQuantity + quantity;

        const newAvgPrice =
            (
                oldQuantity * oldAvgPrice +
                quantity * currentPrice
            ) / totalQuantity;

        portfolio[coin].quantity = totalQuantity;
        portfolio[coin].avgBuyPrice = newAvgPrice;

        await user.save();
        await portfolio.save();

        res.status(200).json({
            message: "Transaction Successfully !",
            user,
            portfolio
        })

    }
    catch (error) {
        res.status(500).json({
            message: "Server Error"
        });


    }

}

export const sellCoin = async (req, res) => {

    try {
        const { coin, quantity } = req.body;
        const portfolio = await Portfolio.findOne(
            { userId: req.user._id }
        );

        if (!portfolio) {
            return res.status(401).json(
                {
                    message: "Portfolio not found!"
                }
            )
        }
        
        if (quantity <= 0) {
            return res.status(400).json({
                message: "Invalid Quantity"
            });
        }
        if (portfolio[coin].quantity < quantity) {
            return res.status(401).json(
                {
                    message: "Not enough coins"
                }
            )
        }
        const currentPrice = marketState[coin];
        const sellValue = currentPrice * quantity;
        const user = await User.findById(req.user._id);
        user.walletBalance += sellValue;

        portfolio[coin].quantity -= quantity;
        if (portfolio[coin].quantity === 0) {
            portfolio[coin].avgBuyPrice = 0;
        }
        await user.save();
        await portfolio.save();

        res.status(200).json({
            message: "Transaction Successfully !",
            user,
            portfolio
        })

    }
    catch (error) {
        res.status(500).json({
            message: "Server Error"
        });

    }

}