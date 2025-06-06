import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import authService from "../modules/auth/auth.service.js";
import * as db from "../db/db.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Configure Passport JWT Strategy
 */
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
      issuer: "food-helper-api",
      audience: "food-helper-client",
    },
    async (payload, done) => {
      try {
        const user = await authService.getUserById(payload.userId);
        if (user && user.is_active) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

/**
 * Configure Passport Local Strategy for login
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const ipAddress = getClientIpAddress(req);
        const userAgent = req.get("User-Agent");
        const { rememberMe } = req.body;

        const result = await authService.loginUser({
          email,
          password,
          ipAddress,
          userAgent,
          rememberMe,
        });

        return done(null, result);
      } catch (error) {
        return done(null, false, { message: error.message });
      }
    }
  )
);

/**
 * Authentication middleware using Passport JWT
 */
export const authenticateToken = passport.authenticate("jwt", {
  session: false,
});

/**
 * Authentication middleware for login
 */
export const authenticateLocal = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    // Store user and auth info for the controller
    req.user = user;
    req.authInfo = info;

    next();
  })(req, res, next);
};

/**
 * Optional authentication middleware - doesn't fail if no token
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "food-helper-api",
      audience: "food-helper-client",
    });

    authService
      .getUserById(decoded.userId)
      .then((user) => {
        if (user && user.is_active) {
          req.user = user;
        }
        next();
      })
      .catch(() => next());
  } catch (error) {
    next();
  }
};

/**
 * Get client IP address (Cloudflare compatible)
 */
export const getClientIpAddress = (req) => {
  return (
    req.headers["cf-connecting-ip"] || // Cloudflare real IP
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.ip ||
    "127.0.0.1"
  );
};

/**
 * Add request metadata middleware
 */
export const addRequestMetadata = (req, res, next) => {
  req.ipAddress = getClientIpAddress(req);
  req.userAgent = req.get("User-Agent") || "Unknown";
  next();
};

/**
 * Session validation middleware
 */
export const validateSession = async (req, res, next) => {
  if (!req.user) {
    return next();
  }

  try {
    // Get IP address (fallback if addRequestMetadata wasn't called)
    const ipAddress = req.ipAddress || getClientIpAddress(req);

    // Check if user has active session
    const result = await db.query(
      `SELECT session_id FROM user_sessions 
       WHERE user_id = $1 AND ip_address = $2 AND is_active = true AND expires_at > CURRENT_TIMESTAMP
       LIMIT 1`,
      [req.user.user_id, ipAddress]
    );
    if (result.rows.length === 0) {
      // Session not found or expired, but don't fail the request
      return next();
    }

    // Update last activity
    await db.query(
      "UPDATE user_sessions SET last_activity = CURRENT_TIMESTAMP WHERE user_id = $1 AND ip_address = $2 AND is_active = true",
      [req.user.user_id, ipAddress]
    );

    next();
  } catch (error) {
    console.error("Session validation error:", error);
    next();
  }
};

export default {
  authenticateToken,
  authenticateLocal,
  optionalAuth,
  getClientIpAddress,
  addRequestMetadata,
  validateSession,
};
