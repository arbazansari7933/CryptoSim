import express from "express";
import { getPortfolio } from "../controllers/PortfolioController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router=express.Router();
router.get("/", authMiddleware, getPortfolio);
export default router;