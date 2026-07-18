import express from "express";
import chat from "../controllers/ai.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Grounded AI chat endpoint
router.post("/chat", protect, chat);

export default router;
