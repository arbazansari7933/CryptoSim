import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

import { getTransactions, } from "../controllers/transactionController.js";

const router = express.Router();

router.get( "/", authMiddleware, getTransactions );

export default router;