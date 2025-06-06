import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";

dotenv.config();
/**
 * General rate limiting
 */
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.GENERAL_RATE_LIMIT) || 100,
  message: {
    error: "Too many requests from this IP, please try again later",
    retryAfter: 15 * 60, // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for trusted IPs or admin users
    const trustedIPs = ["127.0.0.1", "::1"];
    const clientIP = req.ip || req.remoteAddress;
    return trustedIPs.includes(clientIP);
  },
});

/**
 * Authentication endpoints rate limiting
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT) || 5,
  message: {
    error:
      "Too many authentication attempts from this IP, please try again later",
    retryAfter: 15 * 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

/**
 * Search endpoints rate limiting
 */
export const searchRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: parseInt(process.env.SEARCH_RATE_LIMIT) || 30,
  message: {
    error: "Too many search requests from this IP, please slow down",
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiting for sensitive operations
 */
export const strictRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    error: "Too many sensitive operation attempts, please try again later",
    retryAfter: 60 * 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Enhanced helmet configuration (Cloudflare compatible)
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      connectSrc: [
        "'self'",
        "https://api_food_helper.kuchmambetov.dev",
        "https://food_helper.kuchmambetov.dev",
      ],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  // Allow Cloudflare to handle some security headers
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
});

/**
 * CORS configuration
 */
export const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      "http://localhost:5173",
      "https://localhost:5173",
      "http://localhost:3000",
      // Production domains
      "https://food_helper.kuchmambetov.dev",
      "https://api_food_helper.kuchmambetov.dev",
    ].filter(Boolean);

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  maxAge: 86400, // 24 hours
};

/**
 * Compression middleware
 */
export const compressionMiddleware = compression({
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) {
      return false;
    }
    return compression.filter(req, res);
  },
  threshold: 1024, // Only compress responses that are larger than 1KB
});

/**
 * Request size limiting
 */
export const requestSizeLimit = (req, res, next) => {
  const maxSize = process.env.MAX_REQUEST_SIZE || "10mb";
  // This is handled by express.json({ limit: maxSize }) in server setup
  next();
};

/**
 * Sanitize request headers (Cloudflare compatible)
 */
export const sanitizeHeaders = (req, res, next) => {
  // Don't remove Cloudflare headers - they're needed for proper IP detection
  // Only remove potentially dangerous headers that could cause issues
  delete req.headers["x-forwarded-server"];

  // Ensure proper content type for JSON requests
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    const contentType = req.headers["content-type"];
    if (
      contentType &&
      !contentType.includes("application/json") &&
      !contentType.includes("multipart/form-data")
    ) {
      return res.status(415).json({ error: "Unsupported media type" });
    }
  }

  next();
};

/**
 * Request logging for security monitoring
 */
export const securityLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log request details for security monitoring
  const logData = {
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
    userId: req.user ? req.user.user_id : null,
  };

  // Log sensitive endpoints
  const sensitiveEndpoints = ["/auth", "/admin", "/api/auth"];
  const isSensitive = sensitiveEndpoints.some((endpoint) =>
    req.url.includes(endpoint)
  );

  if (isSensitive || req.method !== "GET") {
    console.log("Security Log:", JSON.stringify(logData));
  }

  // Track response time
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    if (duration > 5000) {
      // Log slow requests
      console.log(
        `Slow request detected: ${req.method} ${req.url} - ${duration}ms`
      );
    }
  });

  next();
};

/**
 * Prevent parameter pollution
 */
export const preventParameterPollution = (req, res, next) => {
  // Convert array parameters to single values (take the last one)
  for (const key in req.query) {
    if (Array.isArray(req.query[key])) {
      req.query[key] = req.query[key][req.query[key].length - 1];
    }
  }

  next();
};

export default {
  generalRateLimit,
  authRateLimit,
  searchRateLimit,
  strictRateLimit,
  securityHeaders,
  corsOptions,
  compressionMiddleware,
  requestSizeLimit,
  sanitizeHeaders,
  securityLogger,
  preventParameterPollution,
};
