import express from "express";
import authController from "./auth.controller.js";
import {
  authenticateToken,
  authenticateLocal,
  addRequestMetadata,
  optionalAuth,
  validateSession,
} from "../../middleware/auth.js";
import { authRateLimit, strictRateLimit } from "../../middleware/security.js";
import {
  validateRegistration,
  validateLogin,
  validatePasswordChange,
  validateProfileUpdate,
  validateRefreshToken,
} from "../../middleware/validation.js";

const router = express.Router();

// Apply request metadata middleware to all routes
router.use(addRequestMetadata);

// Public routes with rate limiting
router.post(
  "/auth/register",
  authRateLimit,
  validateRegistration,
  authController.register
);

router.post(
  "/auth/login",
  authRateLimit,
  validateLogin,
  authenticateLocal,
  authController.login
);

router.post(
  "/auth/refresh-token",
  authRateLimit,
  validateRefreshToken,
  authController.refreshToken
);

// Protected routes
router.post("/auth/logout", optionalAuth, authController.logout); // Use optional auth for logout

router.get(
  "/auth/profile",
  authenticateToken,
  validateSession,
  authController.getProfile
);

router.put(
  "/auth/profile",
  authenticateToken,
  validateSession,
  validateProfileUpdate,
  authController.updateProfile
);

router.post(
  "/auth/change-password",
  authenticateToken,
  validateSession,
  strictRateLimit,
  validatePasswordChange,
  authController.changePassword
);

router.get(
  "/auth/verify-token",
  authenticateToken,
  validateSession,
  authController.verifyToken
);

// Security management routes
router.get(
  "/auth/sessions",
  authenticateToken,
  validateSession,
  authController.getUserSessions
);

router.delete(
  "/auth/sessions/:sessionId",
  authenticateToken,
  validateSession,
  authController.revokeSession
);

// Admin routes
router.post(
  "/auth/admin/cleanup",
  authenticateToken,
  validateSession,
  strictRateLimit,
  authController.cleanupExpiredSessions
);

export default router;
