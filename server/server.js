import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import cookieParser from "cookie-parser";
import fs from "fs";
import https from "https";
import selfsigned from "selfsigned";

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
import authService from "./modules/auth/auth.service.js";

dotenv.config();
const app = express();

// Trust proxy for accurate IP addresses (Cloudflare setup)
app.set("trust proxy", true);

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
import inventoryRoutes from "./modules/inventory/inventory.routes.js";
import plannerRoutes from "./modules/planner/planner.router.js";

// API routes
app.use(authRoutes);
app.use(dishesRoutes);
app.use(inventoryRoutes);
app.use(plannerRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Server setup (replaced to support HTTPS)
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
const sslKeyPath = process.env.SSL_KEY_PATH;
const sslCertPath = process.env.SSL_CERT_PATH;

// Determine SSL options (env paths or self-signed for Cloudflare proxy)
let serverOptions;
if (sslKeyPath && sslCertPath) {
  serverOptions = {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath),
  };
} else if (process.env.CF_PROXY === "true") {
  // Generate a temporary self-signed certificate
  const attrs = [{ name: "commonName", value: HOST }];
  const pems = selfsigned.generate(attrs, { days: 365 });
  serverOptions = {
    key: pems.private,
    cert: pems.cert,
  };
} // else serverOptions remains undefined for plain HTTP

// Unified server start function
const startServer = (serverInstance, protocol) => {
  serverInstance.listen(PORT, HOST, async () => {
    console.log(
      `🚀 ${protocol.toUpperCase()} Server running in ${
        process.env.NODE_ENV
      } mode on ${protocol}://${HOST}:${PORT}`
    );
    // Schedule cleanup of expired tokens and sessions
    await authService.cleanupExpiredTokens().catch(console.error);
    setInterval(
      () => authService.cleanupExpiredTokens().catch(console.error),
      24 * 60 * 60 * 1000
    );
    console.log("📅 Session cleanup scheduled to run every 24 hours");
  });
};

if (serverOptions) {
  const httpsServer = https.createServer(serverOptions, app);
  startServer(httpsServer, "https");
} else {
  startServer(app, "http");
}
