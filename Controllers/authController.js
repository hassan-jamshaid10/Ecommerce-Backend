const { signup, login, sendResetPasswordEmail, resetPassword } = require("../Services/authService");
const { validationResult } = require("express-validator");

const handleSignup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, email, phone, password } = req.body;
  try {
    const token = await signup(username, email, phone, password);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await login(email, password);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const response = await sendResetPasswordEmail(email);
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const handleResetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const response = await resetPassword(email, newPassword);
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { handleSignup, handleLogin, handleForgotPassword, handleResetPassword };
