import express from "express";
import authController from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import authValidator from "../validators/auth.validator.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Register a new user (with dynamic farmer profile registration)
router.post("/register", validate(authValidator.register), authController.register);

// Log in
router.post("/login", validate(authValidator.login), authController.login);

// Get current profile
router.get("/me", protect, authController.getMe);

export default router;
