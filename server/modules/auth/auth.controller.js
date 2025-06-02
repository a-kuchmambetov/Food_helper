import authService from "./auth.service.js";
import { getClientIpAddress } from "../../middleware/auth.js";
import * as db from "../../db/db.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Register new user
 */
async function register(req, res) {
  try {
    const { email, username, password, firstName, lastName } = req.body;
    const ipAddress = getClientIpAddress(req);

    const result = await authService.registerUser({
      email,
      username,
      password,
      firstName,
      lastName,
    });

    // Log registration event
    await authService.logSecurityEvent(
      result.user.user_id,
      "USER_REGISTERED",
      { email, username },
      ipAddress,
      req.get("User-Agent")
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        userId: result.user.user_id,
        email: result.user.email,
        username: result.user.username,
        firstName: result.user.first_name,
        lastName: result.user.last_name,
        role: result.user.role,
        isVerified: result.user.is_verified,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Log failed registration
    await authService.logSecurityEvent(
      null,
      "REGISTRATION_FAILED",
      {
        email: req.body.email,
        username: req.body.username,
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

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

    // Set new refresh token as httpOnly cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Token refreshed successfully",
      accessToken: result.accessToken,
    });
  } catch (error) {
    console.error("Token refresh error:", error);

    // Clear invalid refresh token cookie
    res.clearCookie("refreshToken");

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
    const userId = req.user?.user_id;

    if (refreshToken && userId) {
      await authService.logoutUser(refreshToken, ipAddress, userId);
    }

    // Clear refresh token cookie
    res.clearCookie("refreshToken");

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
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
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
    const { firstName, lastName, username } = req.body;
    const userId = req.user.user_id;

    const updatedUser = await authService.updateUserProfile(userId, {
      firstName,
      lastName,
      username,
    });

    res.json({
      message: "Profile updated successfully",
      user: {
        userId: updatedUser.user_id,
        email: updatedUser.email,
        username: updatedUser.username,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
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
      username: req.user.username,
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
};
