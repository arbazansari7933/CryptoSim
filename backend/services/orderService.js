import Order from "../models/Order.js";
import Portfolio from "../models/Portfolio.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const processOrders = async (
  coin,
  currentPrice
) => {
  try {
    const pendingOrders = await Order.find({
      coin,
      status: "PENDING",
    });

    for (const order of pendingOrders) {

      // LOCK ORDER
      const lockedOrder =
        await Order.findOneAndUpdate(
          {
            _id: order._id,
            status: "PENDING",
          },
          {
            status: "PROCESSING",
          },
          {
            new: true,
          }
        );

      if (!lockedOrder) continue;

      // BUY ORDER
      if (
        lockedOrder.type === "BUY" &&
        currentPrice <= lockedOrder.targetPrice
      ) {
        const user =
          await User.findById(
            lockedOrder.userId
          );

        const portfolio =
          await Portfolio.findOne({
            userId: lockedOrder.userId,
          });

        if (!user || !portfolio) {
          lockedOrder.status = "PENDING";
          await lockedOrder.save();
          continue;
        }

        const cost =
          lockedOrder.quantity *
          currentPrice;

        if (
          user.walletBalance < cost
        ) {
          lockedOrder.status = "PENDING";
          await lockedOrder.save();
          continue;
        }

        user.walletBalance -= cost;

        const oldQuantity =
          portfolio[coin].quantity;

        const oldAvgPrice =
          portfolio[coin].avgBuyPrice;

        const totalQuantity =
          oldQuantity +
          lockedOrder.quantity;

        const newAvgPrice =
          (
            oldQuantity *
              oldAvgPrice +
            lockedOrder.quantity *
              currentPrice
          ) / totalQuantity;

        portfolio[coin].quantity =
          totalQuantity;

        portfolio[coin].avgBuyPrice =
          newAvgPrice;

        await user.save();
        await portfolio.save();

        await Transaction.create({
          userId:
            lockedOrder.userId,
          coin,
          type: "BUY",
          quantity:
            lockedOrder.quantity,
          price: currentPrice,
          totalAmount: cost,
        });

        lockedOrder.status =
          "EXECUTED";

        lockedOrder.executedPrice =
          currentPrice;

        lockedOrder.executedAt =
          new Date();

        await lockedOrder.save();

        console.log(
          "BUY EXECUTED",
          lockedOrder._id
        );
      }

      // SELL ORDER
      else if (
        lockedOrder.type === "SELL" &&
        currentPrice >=
          lockedOrder.targetPrice
      ) {
        const user =
          await User.findById(
            lockedOrder.userId
          );

        const portfolio =
          await Portfolio.findOne({
            userId: lockedOrder.userId,
          });

        if (!user || !portfolio) {
          lockedOrder.status = "PENDING";
          await lockedOrder.save();
          continue;
        }

        if (
          portfolio[coin]
            .quantity <
          lockedOrder.quantity
        ) {
          lockedOrder.status = "PENDING";
          await lockedOrder.save();
          continue;
        }

        const revenue =
          lockedOrder.quantity *
          currentPrice;

        user.walletBalance +=
          revenue;

        portfolio[coin].quantity -=
          lockedOrder.quantity;

        if (
          portfolio[coin]
            .quantity === 0
        ) {
          portfolio[coin].avgBuyPrice =
            0;
        }

        await user.save();
        await portfolio.save();

        await Transaction.create({
          userId:
            lockedOrder.userId,
          coin,
          type: "SELL",
          quantity:
            lockedOrder.quantity,
          price: currentPrice,
          totalAmount: revenue,
        });

        lockedOrder.status =
          "EXECUTED";

        lockedOrder.executedPrice =
          currentPrice;

        lockedOrder.executedAt =
          new Date();

        await lockedOrder.save();

        console.log(
          "SELL EXECUTED",
          lockedOrder._id
        );
      }

      // PRICE NOT REACHED
      else {
        lockedOrder.status =
          "PENDING";

        await lockedOrder.save();
      }
    }
  } catch (error) {
    console.error(
      "Order Processing Error:",
      error.message
    );
  }
};