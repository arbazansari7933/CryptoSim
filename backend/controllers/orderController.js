import Order from "../models/Order.js";

export const placeOrder = async (req, res) => {
    try {
        const { coin, type, quantity, targetPrice } = req.body;
        const order = await Order.create({
            userId: req.user._id,
            coin,
            type,
            quantity,
            targetPrice,
        })
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getOrders = async (req, res) => {
    try {
        console.log("1");

        const orders = await Order.find({
            userId: req.user._id,
        }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const cancelOrder = async (
    req,
    res
) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }
        if (order.status !== "PENDING") {
            return res.status(400).json({
                message: "Only pending orders can be cancelled",
            });
        }

        order.status =
            "CANCELLED";

        await order.save();

        res.json({
            message:
                "Order cancelled",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};