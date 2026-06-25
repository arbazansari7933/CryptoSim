import Order from "../models/Order.js";
import { executeBuy, executeSell } from "./tradeService.js";
import mongoose from "mongoose";

export const processOrders = async (coin, currentPrice) => {
  try {
    const pendingOrders = await Order.find({ coin, status: "PENDING", });

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
      // someone else already grabbed this order
      if (!lockedOrder) continue;

      const shouldExecuteBuy = lockedOrder.type === "BUY" && currentPrice <= lockedOrder.targetPrice;
      const shouldExecuteSell = lockedOrder.type === "SELL" && currentPrice >= lockedOrder.targetPrice;

      // Price condition not met yet — release the lock, try again next tick.
      if (!shouldExecuteBuy && !shouldExecuteSell) {
        lockedOrder.status = "PENDING";
        await lockedOrder.save();
        continue;
      }

      const session = await mongoose.startSession();
      let executed = false;
      try {
        await session.withTransaction(async () => {
          if (shouldExecuteBuy) {
            await executeBuy(lockedOrder, coin, currentPrice, session);
          }
          else {
            await executeSell(lockedOrder, coin, currentPrice, session);
          }
          lockedOrder.status = "EXECUTED";
          lockedOrder.executedPrice = currentPrice;
          lockedOrder.executedAt = new Date();
          await lockedOrder.save({ session });
          executed = true;
        });
        if (executed) {
          console.log(`${lockedOrder.type} EXECUTED `, lockedOrder._id.toString());
        }
      } catch (error) {
        console.log(`Order ${lockedOrder._id} failed: ${error.message}`);
      }
      finally {
        await session.endSession();
      }
      // Release lock if transaction failed
      if (!executed) {
        await Order.updateOne(
          { _id: lockedOrder._id },
          {
            $set: {
              status: "PENDING",
            },
          }
        );
      }
    }

  } catch (error) {
    console.error("Order Processing Error:", error.message);
  }
};