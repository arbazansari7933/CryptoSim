import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { buyCoin , sellCoin} from "../controllers/tradeController.js";

const router=express.Router();
router.post("/buy", authMiddleware, buyCoin);
router.post("/sell", authMiddleware, sellCoin);
export default router;