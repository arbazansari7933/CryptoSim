import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import Transaction from "../models/Transaction.js";

export async function executeBuy(order, coin, currentPrice, session) {
  const cost = order.quantity * currentPrice;

  // Deduct wallet
  const user = await User.findOneAndUpdate(
    {
      _id: order.userId,
      walletBalance: { $gte: cost },
    },
    {
      $inc: { walletBalance: -cost },
    },
    {
      session,
      new: true,
    }
  );

  if (!user) {
    throw new Error("INSUFFICIENT_BALANCE");
  }

  // Update portfolio
  const portfolio = await Portfolio.findOne(
    { userId: order.userId },
    null,
    { session }
  );

  if (!portfolio) {
    throw new Error("PORTFOLIO_NOT_FOUND");
  }
  

  const holding = portfolio[coin];

  const totalQuantity = holding.quantity + order.quantity;

  const totalCost =
    holding.quantity * holding.avgBuyPrice +
    order.quantity * currentPrice;

  holding.quantity = totalQuantity;
  holding.avgBuyPrice = totalCost / totalQuantity;

  await portfolio.save({ session });

  // Create transaction
  await Transaction.create(
    [
      {
        userId: order.userId,
        coin,
        type: "BUY",
        quantity: order.quantity,
        price: currentPrice,
        totalAmount: cost,
      },
    ],
    { session }
  );
}
export async function executeSell(order, coin, currentPrice, session) {
  const revenue = order.quantity * currentPrice;

  const portfolio = await Portfolio.findOneAndUpdate(
    {
      userId: order.userId,
      [`${coin}.quantity`]: { $gte: order.quantity },
    },
    {
      $inc: {
        [`${coin}.quantity`]: -order.quantity,
      },
    },
    {
      session,
      new: true,
    }
  );
  console.log("Coin:", coin);
console.log("Order Qty:", order.quantity);
console.log("Holding:", portfolio?.[coin]);

  if (!portfolio) {
    throw new Error("INSUFFICIENT_HOLDINGS");
  }

  if (portfolio[coin].quantity === 0) {
    portfolio[coin].avgBuyPrice = 0;
    await portfolio.save({ session });
  }

  await User.findOneAndUpdate(
    { _id: order.userId },
    {
      $inc: {
        walletBalance: revenue,
      },
    },
    { session }
  );

  await Transaction.create(
    [
      {
        userId: order.userId,
        coin,
        type: "SELL",
        quantity: order.quantity,
        price: currentPrice,
        totalAmount: revenue,
      },
    ],
    { session }
  );
}