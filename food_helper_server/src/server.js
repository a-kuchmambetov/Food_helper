import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import * as db from "../db/db.js";

dotenv.config();
const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});

app.post("/login", (req, res) => {
  return res.json({ message: "Login successful" });
});

app.get("/:userId", async (req, res, next) => {
  const result = await db.query("SELECT * FROM users WHERE user_id = $1", [
    req.params.userId,
  ]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "User not found" });
  }
  res.send(result.rows[0]);
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
