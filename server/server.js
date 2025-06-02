import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import cookieParser from "cookie-parser";

// Import security middleware
import {
  generalRateLimit,
  securityHeaders,
  corsOptions,
  compressionMiddleware,
  sanitizeHeaders,
  securityLogger,
  preventParameterPollution,
} from "./middleware/security.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

// Trust proxy for accurate IP addresses
app.set("trust proxy", 1);

// Security middleware (applied first)
app.use(securityHeaders);
app.use(compressionMiddleware);
app.use(generalRateLimit);
app.use(sanitizeHeaders);
app.use(preventParameterPollution);
app.use(securityLogger);

// Basic middleware setup
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Passport middleware
app.use(passport.initialize());

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Food Helper API is running!",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Import and use routes
import authRoutes from "./modules/auth/auth.routes.js";
import dishesRoutes from "./modules/dishes/dishes.routes.js";

// API routes
app.use(authRoutes);
app.use(dishesRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}\n`
  );
});
