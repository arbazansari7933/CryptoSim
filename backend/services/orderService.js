import Order from "../models/Order.js";
import Portfolio from "../models/Portfolio.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const processOrders = async (
  coin,
  currentPrice
) => {
  const pendingOrders = await Order.find({
    coin,
    status: "PENDING",
  });

  for (const order of pendingOrders) {

    if (
      order.type === "BUY" &&
      currentPrice <= order.targetPrice
    ) {

      const user =
        await User.findById(order.userId);

      const portfolio =
        await Portfolio.findOne({
          userId: order.userId,
        });

      if (!user || !portfolio)
        continue;

      const cost =
        order.quantity * currentPrice;

      if (user.walletBalance < cost)
        continue;

      user.walletBalance -= cost;

      const oldQuantity =
        portfolio[coin].quantity;

      const oldAvgPrice =
        portfolio[coin].avgBuyPrice;

      const totalQuantity =
        oldQuantity + order.quantity;

      const newAvgPrice =
        (
          oldQuantity *
          oldAvgPrice +
          order.quantity *
          currentPrice
        ) / totalQuantity;

      portfolio[coin].quantity =
        totalQuantity;

      portfolio[coin].avgBuyPrice =
        newAvgPrice;

      await user.save();
      await portfolio.save();

      await Transaction.create({
        userId: order.userId,
        coin,
        type: "BUY",
        quantity: order.quantity,
        price: currentPrice,
        totalAmount: cost,
      });

      order.status = "EXECUTED";
      order.executedPrice =
        currentPrice;
      order.executedAt =
        new Date();

      await order.save();

      console.log(
        "BUY EXECUTED",
        order._id
      );
    }

    else if (
      order.type === "SELL" &&
      currentPrice >= order.targetPrice
    ) {

      const user =
        await User.findById(order.userId);

      const portfolio =
        await Portfolio.findOne({
          userId: order.userId,
        });

      if (!user || !portfolio)
        continue;

      if (
        portfolio[coin].quantity <
        order.quantity
      ) {
        continue;
      }

      const revenue =
        order.quantity * currentPrice;

      user.walletBalance += revenue;

      portfolio[coin].quantity -=
        order.quantity;

      if (
        portfolio[coin].quantity === 0
      ) {
        portfolio[coin].avgBuyPrice = 0;
      }

      await user.save();
      await portfolio.save();

      await Transaction.create({
        userId: order.userId,
        coin,
        type: "SELL",
        quantity: order.quantity,
        price: currentPrice,
        totalAmount: revenue,
      });

      order.status = "EXECUTED";
      order.executedPrice =
        currentPrice;

      order.executedAt =
        new Date();

      await order.save();

      console.log(
        "SELL EXECUTED",
        order._id
      );
    }
  }
};