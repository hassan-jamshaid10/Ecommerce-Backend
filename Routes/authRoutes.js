const express = require("express");
const { check } = require("express-validator");
const { handleSignup, handleLogin, handleForgotPassword, handleResetPassword } = require("../Controllers/authController");

const router = express.Router();

router.post(
  "/signup",
  [
    check("username").notEmpty().withMessage("Username is required"),
    check("email").isEmail().withMessage("Valid email is required"),
    check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  handleSignup
);

router.post("/login", handleLogin);
router.post("/forgot-password", handleForgotPassword);
router.post("/reset-password", handleResetPassword);

module.exports = router;
