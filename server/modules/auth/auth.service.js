import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import * as db from "../../db/db.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE_IN = process.env.JWT_EXPIRE_IN || "15m";
const REFRESH_TOKEN_EXPIRE_IN = process.env.REFRESH_TOKEN_EXPIRE_IN || "7d";
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 30 * 60 * 1000; // 30 minutes

/**
 * Hash password using bcrypt
 */
async function hashPassword(password) {
  return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

/**
 * Compare password with hash
 */
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
function generateAccessToken(user) {
  const payload = {
    userId: user.user_id,
    email: user.email,
    username: user.username,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE_IN,
    issuer: "food-helper-api",
    audience: "food-helper-client",
  });
}

/**
 * Generate refresh token
 */
function generateRefreshToken() {
  return crypto.randomBytes(40).toString("hex");
}

/**
 * Create refresh token in database
 */
async function createRefreshToken(userId, ipAddress) {
  const token = generateRefreshToken();
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + ms(REFRESH_TOKEN_EXPIRE_IN));

  await db.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, created_by_ip)
     VALUES ($1, $2, $3, $4)`,
    [userId, tokenHash, expiresAt, ipAddress]
  );

  return token;
}

/**
 * Verify refresh token
 */
async function verifyRefreshToken(token, ipAddress) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const result = await db.query(
    `SELECT rt.*, u.user_id, u.email, u.username, u.role, u.is_active
     FROM refresh_tokens rt
     JOIN users u ON rt.user_id = u.user_id
     WHERE rt.token_hash = $1 AND rt.expires_at > CURRENT_TIMESTAMP AND rt.revoked_at IS NULL`,
    [tokenHash]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid or expired refresh token");
  }

  const refreshTokenData = result.rows[0];

  if (!refreshTokenData.is_active) {
    throw new Error("User account is deactivated");
  }

  return refreshTokenData;
}

/**
 * Revoke refresh token
 */
async function revokeRefreshToken(token, ipAddress, replacedByToken = null) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  await db.query(
    `UPDATE refresh_tokens 
     SET revoked_at = CURRENT_TIMESTAMP, revoked_by_ip = $1, replaced_by_token = $2
     WHERE token_hash = $3`,
    [ipAddress, replacedByToken, tokenHash]
  );
}

/**
 * Clean up expired tokens
 */
async function cleanupExpiredTokens() {
  await db.query("SELECT cleanup_expired_tokens_and_sessions()");
}

/**
 * Register new user
 */
async function registerUser({
  email,
  username,
  password,
  firstName,
  lastName,
}) {
  // Check if user already exists
  const existingUser = await db.query(
    "SELECT user_id FROM users WHERE email = $1 OR username = $2",
    [email, username]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("User with this email or username already exists");
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create email verification token
  const emailVerificationToken = crypto.randomBytes(32).toString("hex");
  const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Insert user
  const result = await db.query(
    `INSERT INTO users (email, username, password_hash, first_name, last_name, 
     email_verification_token, email_verification_expires)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING user_id, email, username, first_name, last_name, role, is_active, is_verified, created_at`,
    [
      email,
      username,
      passwordHash,
      firstName,
      lastName,
      emailVerificationToken,
      emailVerificationExpires,
    ]
  );

  const user = result.rows[0];

  // Log security event
  await logSecurityEvent(user.user_id, "USER_REGISTERED", { email, username });

  return {
    user,
    emailVerificationToken,
  };
}

/**
 * Login user
 */
async function loginUser({ email, password, ipAddress, userAgent }) {
  // Get user with login attempt tracking
  const userResult = await db.query(
    `SELECT user_id, email, username, password_hash, role, is_active, is_verified,
     login_attempts, locked_until, failed_login_attempts
     FROM users WHERE email = $1`,
    [email]
  );

  if (userResult.rows.length === 0) {
    await logSecurityEvent(null, "LOGIN_FAILED", {
      email,
      reason: "user_not_found",
      ip_address: ipAddress,
    });
    throw new Error("Invalid credentials");
  }

  const user = userResult.rows[0];

  // Check if account is locked
  if (user.locked_until && new Date() < new Date(user.locked_until)) {
    await logSecurityEvent(user.user_id, "LOGIN_BLOCKED", {
      reason: "account_locked",
      ip_address: ipAddress,
    });
    throw new Error(
      "Account is temporarily locked due to too many failed login attempts"
    );
  }

  // Check if account is active
  if (!user.is_active) {
    await logSecurityEvent(user.user_id, "LOGIN_BLOCKED", {
      reason: "account_inactive",
      ip_address: ipAddress,
    });
    throw new Error("Account is deactivated");
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password_hash);

  if (!isPasswordValid) {
    // Increment failed login attempts
    const newFailedAttempts = user.failed_login_attempts + 1;
    let updateQuery = "UPDATE users SET failed_login_attempts = $1";
    let queryParams = [newFailedAttempts, user.user_id];

    // Lock account if max attempts reached
    if (newFailedAttempts >= MAX_LOGIN_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + LOCK_TIME);
      updateQuery += ", locked_until = $3";
      queryParams.splice(2, 0, lockUntil);
    }

    updateQuery += " WHERE user_id = $2";
    await db.query(updateQuery, queryParams);

    await logSecurityEvent(user.user_id, "LOGIN_FAILED", {
      reason: "invalid_password",
      failed_attempts: newFailedAttempts,
      ip_address: ipAddress,
    });

    throw new Error("Invalid credentials");
  }

  // Reset failed login attempts on successful login
  await db.query(
    `UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login = CURRENT_TIMESTAMP
     WHERE user_id = $1`,
    [user.user_id]
  );

  // Create session
  await createUserSession(user.user_id, ipAddress, userAgent);

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = await createRefreshToken(user.user_id, ipAddress);

  await logSecurityEvent(user.user_id, "LOGIN_SUCCESS", {
    ip_address: ipAddress,
  });

  return {
    user: {
      userId: user.user_id,
      email: user.email,
      username: user.username,
      role: user.role,
      isVerified: user.is_verified,
    },
    accessToken,
    refreshToken,
  };
}

/**
 * Refresh access token
 */
async function refreshAccessToken(refreshToken, ipAddress) {
  const tokenData = await verifyRefreshToken(refreshToken, ipAddress);

  // Generate new tokens
  const newAccessToken = generateAccessToken(tokenData);
  const newRefreshToken = await createRefreshToken(
    tokenData.user_id,
    ipAddress
  );

  // Revoke old refresh token
  await revokeRefreshToken(refreshToken, ipAddress, newRefreshToken);

  await logSecurityEvent(tokenData.user_id, "TOKEN_REFRESHED", {
    ip_address: ipAddress,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

/**
 * Logout user
 */
async function logoutUser(refreshToken, ipAddress, userId) {
  if (refreshToken) {
    await revokeRefreshToken(refreshToken, ipAddress);
  }

  // Deactivate all user sessions
  await db.query(
    "UPDATE user_sessions SET is_active = false WHERE user_id = $1",
    [userId]
  );

  await logSecurityEvent(userId, "LOGOUT", { ip_address: ipAddress });
}

/**
 * Create user session
 */
async function createUserSession(userId, ipAddress, userAgent) {
  const expiresAt = new Date(Date.now() + ms(REFRESH_TOKEN_EXPIRE_IN));

  await db.query(
    `INSERT INTO user_sessions (user_id, ip_address, user_agent, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [userId, ipAddress, userAgent, expiresAt]
  );
}

/**
 * Get user by ID
 */
async function getUserById(userId) {
  const result = await db.query(
    `SELECT user_id, email, username, first_name, last_name, role, is_active, is_verified, created_at
     FROM users WHERE user_id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
}

/**
 * Update user profile
 */
async function updateUserProfile(userId, { firstName, lastName, username }) {
  // Check if username is already taken by another user
  if (username) {
    const existingUser = await db.query(
      "SELECT user_id FROM users WHERE username = $1 AND user_id != $2",
      [username, userId]
    );

    if (existingUser.rows.length > 0) {
      throw new Error("Username is already taken");
    }
  }

  const result = await db.query(
    `UPDATE users SET first_name = COALESCE($1, first_name), 
     last_name = COALESCE($2, last_name), username = COALESCE($3, username)
     WHERE user_id = $4
     RETURNING user_id, email, username, first_name, last_name, role, is_verified`,
    [firstName, lastName, username, userId]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  await logSecurityEvent(userId, "PROFILE_UPDATED", {
    updated_fields: { firstName, lastName, username },
  });

  return result.rows[0];
}

/**
 * Change user password
 */
async function changePassword(userId, { currentPassword, newPassword }) {
  // Get current password hash
  const userResult = await db.query(
    "SELECT password_hash FROM users WHERE user_id = $1",
    [userId]
  );

  if (userResult.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = userResult.rows[0];

  // Verify current password
  const isCurrentPasswordValid = await comparePassword(
    currentPassword,
    user.password_hash
  );
  if (!isCurrentPasswordValid) {
    await logSecurityEvent(userId, "PASSWORD_CHANGE_FAILED", {
      reason: "invalid_current_password",
    });
    throw new Error("Current password is incorrect");
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);

  // Update password
  await db.query("UPDATE users SET password_hash = $1 WHERE user_id = $2", [
    newPasswordHash,
    userId,
  ]);

  // Revoke all refresh tokens to force re-login
  await db.query(
    "UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND revoked_at IS NULL",
    [userId]
  );

  await logSecurityEvent(userId, "PASSWORD_CHANGED");

  return { success: true };
}

/**
 * Log security events
 */
async function logSecurityEvent(
  userId,
  action,
  details = {},
  ipAddress = null,
  userAgent = null
) {
  await db.query(
    `INSERT INTO security_audit_log (user_id, action, details, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, action, JSON.stringify(details), ipAddress, userAgent]
  );
}

/**
 * Helper function to parse time strings
 */
function ms(timeString) {
  const units = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  const match = timeString.match(/^(\d+)([smhd])$/);
  if (!match) return 0;

  return parseInt(match[1]) * units[match[2]];
}

export default {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  createRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  cleanupExpiredTokens,
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getUserById,
  updateUserProfile,
  changePassword,
  logSecurityEvent,
};
