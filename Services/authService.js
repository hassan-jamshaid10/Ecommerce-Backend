const pool = require("../Config/db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

require("dotenv").config();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Signup Service
const signup = async (username, email, phone, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4();

  const result = await pool.query(
    "INSERT INTO users (id, username, email, phone, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [userId, username, email, phone, hashedPassword]
  );

  return generateToken(result.rows[0]);
};

// Login Service
const login = async (email, password) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (result.rows.length === 0) throw new Error("User not found");

  const user = result.rows[0];
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) throw new Error("Invalid credentials");

  return generateToken(user);
};

// Forgot Password Service
const sendResetPasswordEmail = async (email) => {
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (user.rows.length === 0) throw new Error("User not found");

  const resetToken = uuidv4();
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    text: `Click the link to reset your password: ${resetLink}`,
  });

  return { message: "Reset email sent" };
};

// Reset Password Service
const resetPassword = async (email, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, email]);

  return { message: "Password successfully reset" };
};

module.exports = { signup, login, sendResetPasswordEmail, resetPassword };
