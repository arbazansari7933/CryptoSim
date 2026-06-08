import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    placeOrder,
    getOrders,
    cancelOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    placeOrder
);

router.get(
    "/",
    authMiddleware,
    getOrders
);

router.patch(
    "/:id/cancel",
    authMiddleware,
    cancelOrder
);

export default router;