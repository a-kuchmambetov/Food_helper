import express from "express";
import authController from "./auth.controller.js";
import {
  authenticateToken,
  authenticateLocal,
  addRequestMetadata,
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
router.post("/auth/logout", authenticateToken, authController.logout);

router.get("/auth/profile", authenticateToken, authController.getProfile);

router.put(
  "/auth/profile",
  authenticateToken,
  validateProfileUpdate,
  authController.updateProfile
);

router.post(
  "/auth/change-password",
  authenticateToken,
  strictRateLimit,
  validatePasswordChange,
  authController.changePassword
);

router.get("/auth/verify-token", authenticateToken, authController.verifyToken);

// Security management routes
router.get("/auth/sessions", authenticateToken, authController.getUserSessions);

router.delete(
  "/auth/sessions/:sessionId",
  authenticateToken,
  authController.revokeSession
);

export default router;
