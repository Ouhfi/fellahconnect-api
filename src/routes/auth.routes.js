const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const authValidator = require("../validators/auth.validator");
const { protect } = require("../middlewares/auth.middleware");

// Register a new user (with dynamic farmer profile registration)
router.post("/register", validate(authValidator.register), authController.register);

// Log in
router.post("/login", validate(authValidator.login), authController.login);

// Get current profile
router.get("/me", protect, authController.getMe);

module.exports = router;
