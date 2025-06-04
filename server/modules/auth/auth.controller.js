import authService from "./auth.service.js";
import { getClientIpAddress } from "../../middleware/auth.js";
import * as db from "../../db/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Register new user
 */
async function register(req, res) {
  try {
    const { email, name, password } = req.body;
    const ipAddress = getClientIpAddress(req);

    const result = await authService.registerUser({
      email,
      name,
      password,
    });

    // Log registration event
    await authService.logSecurityEvent(
      result.user.user_id,
      "USER_REGISTERED",
      { email, name },
      ipAddress,
      req.get("User-Agent")
    );
    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
      user: {
        userId: result.user.user_id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        isVerified: result.user.is_verified,
      },
      requiresEmailVerification: !result.user.is_verified,
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Log failed registration
    await authService.logSecurityEvent(
      null,
      "REGISTRATION_FAILED",
      {
        email: req.body.email,
        name: req.body.name,
        error: error.message,
      },
      getClientIpAddress(req),
      req.get("User-Agent")
    );

    res.status(400).json({
      error: error.message || "Registration failed",
    });
  }
}

/**
 * Login user (using Passport Local Strategy)
 */
async function login(req, res) {
  try {
    // The user object is set by passport local strategy
    if (!req.user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const { user, accessToken, refreshToken } = req.user;

    // Get rememberMe preference from request body
    const { rememberMe } = req.body;

    // Set refresh token with appropriate expiration based on rememberMe
    const maxAge = rememberMe
      ? 30 * 24 * 60 * 60 * 1000 // 30 days if remember me
      : 7 * 24 * 60 * 60 * 1000; // 7 days default

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain:
        process.env.NODE_ENV === "production" ? ".kuchmambetov.dev" : undefined,
      maxAge: maxAge,
      path: "/",
    });

    res.json({
      message: "Login successful",
      user,
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}

/**
 * Refresh access token
 */
async function refreshToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token not provided" });
    }
    const ipAddress = getClientIpAddress(req);
    const result = await authService.refreshAccessToken(
      refreshToken,
      ipAddress
    );

    // Check if this is an extended session by examining the new refresh token's expiration
    // We can determine this by checking if the token was created with extended duration
    const tokenVerification = await authService.verifyRefreshToken(
      result.refreshToken,
      ipAddress
    );
    const isExtendedSession =
      new Date(tokenVerification.expires_at).getTime() - Date.now() >
      7 * 24 * 60 * 60 * 1000;

    // Set new refresh token with appropriate expiration
    const maxAge = isExtendedSession
      ? 30 * 24 * 60 * 60 * 1000 // 30 days for extended sessions
      : 7 * 24 * 60 * 60 * 1000; // 7 days for regular sessions

    // Set new refresh token as httpOnly cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain:
        process.env.NODE_ENV === "production" ? ".kuchmambetov.dev" : undefined,
      maxAge: maxAge,
      path: "/",
    });

    res.json({
      message: "Token refreshed successfully",
      accessToken: result.accessToken,
    });
  } catch (error) {
    console.error("Token refresh error:", error); // Clear invalid refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain:
        process.env.NODE_ENV === "production" ? ".kuchmambetov.dev" : undefined,
      path: "/",
    });

    res.status(401).json({
      error: error.message || "Invalid refresh token",
    });
  }
}

/**
 * Logout user
 */
async function logout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    const ipAddress = getClientIpAddress(req);
    let userId = req.user?.user_id || req.body?.userId;

    // If passport didn't set user, try to extract from JWT manually
    if (!userId) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            issuer: "food-helper-api",
            audience: "food-helper-client",
          });
          userId = decoded.userId;
          console.log("Extracted userId from JWT:", userId);
        } catch (jwtError) {
          console.warn("Failed to decode JWT manually:", jwtError.message);
        }
      }
    }

    console.log("Logout attempt:", {
      hasRefreshToken: !!refreshToken,
      hasUser: !!req.user,
      userId: userId,
      authHeader: req.headers.authorization ? "present" : "missing",
      bodyUserId: req.body?.userId,
    });

    // If we have a user ID, perform full logout
    if (userId) {
      await authService.logoutUser(refreshToken, ipAddress, userId);
    } else if (refreshToken) {
      // If no user ID but we have refresh token, try to revoke it
      try {
        await authService.revokeRefreshToken(refreshToken, ipAddress);
      } catch (error) {
        console.warn("Failed to revoke refresh token during logout:", error);
      }
    } // Always clear refresh token cookie regardless of user state
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain:
        process.env.NODE_ENV === "production" ? ".kuchmambetov.dev" : undefined,
      path: "/",
    });

    res.json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      error: "Logout failed",
    });
  }
}

/**
 * Get current user profile
 */
async function getProfile(req, res) {
  try {
    const user = await authService.getUserById(req.user.user_id);
    res.json({
      user: {
        userId: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.is_verified,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(404).json({
      error: "User not found",
    });
  }
}

/**
 * Update user profile
 */
async function updateProfile(req, res) {
  try {
    const { name } = req.body;
    const userId = req.user.user_id;

    const updatedUser = await authService.updateUserProfile(userId, {
      name,
    });

    res.json({
      message: "Profile updated successfully",
      user: {
        userId: updatedUser.user_id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        isVerified: updatedUser.is_verified,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(400).json({
      error: error.message || "Failed to update profile",
    });
  }
}

/**
 * Change user password
 */
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.user_id;

    await authService.changePassword(userId, {
      currentPassword,
      newPassword,
    });

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(400).json({
      error: error.message || "Failed to change password",
    });
  }
}

/**
 * Verify token endpoint (for client-side token validation)
 */
async function verifyToken(req, res) {
  // If this endpoint is reached, it means the token is valid (middleware passed)
  res.json({
    valid: true,
    user: {
      userId: req.user.user_id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      isVerified: req.user.is_verified,
    },
  });
}

/**
 * Get user sessions (for security dashboard)
 */
async function getUserSessions(req, res) {
  try {
    const userId = req.user.user_id;

    const result = await db.query(
      `SELECT session_id, ip_address, user_agent, created_at, last_activity, expires_at, is_active
       FROM user_sessions 
       WHERE user_id = $1 
       ORDER BY last_activity DESC`,
      [userId]
    );

    res.json({
      sessions: result.rows,
    });
  } catch (error) {
    console.error("Get user sessions error:", error);
    res.status(500).json({
      error: "Failed to fetch sessions",
    });
  }
}

/**
 * Revoke user session
 */
async function revokeSession(req, res) {
  try {
    const { sessionId } = req.params;
    const userId = req.user.user_id;

    await db.query(
      "UPDATE user_sessions SET is_active = false WHERE session_id = $1 AND user_id = $2",
      [sessionId, userId]
    );

    await authService.logSecurityEvent(
      userId,
      "SESSION_REVOKED",
      { sessionId },
      getClientIpAddress(req),
      req.get("User-Agent")
    );

    res.json({
      message: "Session revoked successfully",
    });
  } catch (error) {
    console.error("Revoke session error:", error);
    res.status(500).json({
      error: "Failed to revoke session",
    });
  }
}

/**
 * Cleanup expired tokens and sessions (Admin endpoint)
 */
async function cleanupExpiredSessions(req, res) {
  try {
    // Only allow admin users to trigger cleanup
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Insufficient permissions. Admin access required.",
      });
    }

    await authService.cleanupExpiredTokens();

    await authService.logSecurityEvent(
      req.user.user_id,
      "CLEANUP_TRIGGERED",
      { trigger: "manual" },
      getClientIpAddress(req),
      req.get("User-Agent")
    );

    res.json({
      message: "Cleanup completed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    res.status(500).json({
      error: "Failed to cleanup expired sessions",
    });
  }
}

/**
 * Debug endpoint to test session activity updates
 */
async function testSessionActivity(req, res) {
  try {
    const userId = req.user.user_id;
    const ipAddress = getClientIpAddress(req);

    // Get current session info
    const result = await db.query(
      `SELECT session_id, created_at, last_activity, expires_at, is_active
       FROM user_sessions 
       WHERE user_id = $1 AND ip_address = $2 AND is_active = true 
       ORDER BY last_activity DESC
       LIMIT 1`,
      [userId, ipAddress]
    );

    res.json({
      message: "Session activity test",
      timestamp: new Date().toISOString(),
      userId: userId,
      ipAddress: ipAddress,
      session: result.rows[0] || null,
      hasSession: result.rows.length > 0,
    });
  } catch (error) {
    console.error("Test session activity error:", error);
    res.status(500).json({
      error: "Failed to test session activity",
    });
  }
}

/**
 * Verify email address
 */
async function verifyEmail(req, res) {
  try {
    const { token } = req.body;
    const ipAddress = getClientIpAddress(req);

    const result = await authService.verifyEmail(token);

    // Log verification event
    await authService.logSecurityEvent(
      result.user.userId,
      "EMAIL_VERIFIED",
      { email: result.user.email },
      ipAddress,
      req.get("User-Agent")
    );

    res.json({
      message: "Email verified successfully",
      user: result.user,
    });
  } catch (error) {
    console.error("Email verification error:", error);

    // Log failed verification
    await authService.logSecurityEvent(
      null,
      "EMAIL_VERIFICATION_FAILED",
      {
        token: req.body.token,
        error: error.message,
      },
      getClientIpAddress(req),
      req.get("User-Agent")
    );

    res.status(400).json({
      error: error.message || "Email verification failed",
    });
  }
}

/**
 * Resend verification email
 */
async function resendVerificationEmail(req, res) {
  try {
    const { email } = req.body;
    const ipAddress = getClientIpAddress(req);

    const result = await authService.resendVerificationEmail(email);

    // Log resend event
    await authService.logSecurityEvent(
      null,
      "VERIFICATION_EMAIL_RESENT",
      { email },
      ipAddress,
      req.get("User-Agent")
    );

    res.json({
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Resend verification email error:", error);

    // Log failed resend
    await authService.logSecurityEvent(
      null,
      "VERIFICATION_EMAIL_RESEND_FAILED",
      {
        email: req.body.email,
        error: error.message,
      },
      getClientIpAddress(req),
      req.get("User-Agent")
    );

    res.status(400).json({
      error: error.message || "Failed to resend verification email",
    });
  }
}

export default {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken,
  getUserSessions,
  revokeSession,
  cleanupExpiredSessions,
  testSessionActivity,
  verifyEmail,
  resendVerificationEmail,
};
