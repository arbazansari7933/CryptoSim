import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { resetWallet } from "../controllers/walletController.js";
const router = express.Router();

router.post( "/reset", authMiddleware, resetWallet);

export default router;