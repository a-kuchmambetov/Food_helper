import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

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

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
