const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./Routes/authRoutes");
const pool = require("./Config/db");

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use("/api/auth", authRoutes);

pool.connect()
  .then(() => console.log("Connected to the database"))
  .catch(err => console.error("Database connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
