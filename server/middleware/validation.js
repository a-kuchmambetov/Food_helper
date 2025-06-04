import { body, validationResult } from "express-validator";

/**
 * Handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

/**
 * Registration validation rules
 */
export const validateRegistration = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("name")
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be between 3 and 100 characters")
    .matches(/^[a-zA-Z0-9_\s]+$/)
    .withMessage(
      "Name can only contain letters, numbers, underscores, and spaces"
    ),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    ),
  handleValidationErrors,
];

/**
 * Login validation rules
 */
export const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),

  body("rememberMe")
    .optional()
    .isBoolean()
    .withMessage("Remember me must be a boolean value"),

  handleValidationErrors,
];

/**
 * Password change validation rules
 */
export const validatePasswordChange = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    ),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Password confirmation does not match");
    }
    return true;
  }),

  handleValidationErrors,
];

/**
 * Profile update validation rules
 */
export const validateProfileUpdate = [
  body("name")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be between 3 and 100 characters")
    .matches(/^[a-zA-Z0-9_\s]+$/)
    .withMessage(
      "Name can only contain letters, numbers, underscores, and spaces"
    ),

  handleValidationErrors,
];

/**
 * Refresh token validation
 */
export const validateRefreshToken = [
  // Make refreshToken optional since it might come from cookies instead of body
  body("refreshToken")
    .optional()
    .isString()
    .withMessage("Refresh token must be a string"),

  // Custom validation to check if refresh token exists in either body or cookies
  (req, res, next) => {
    const bodyToken = req.body.refreshToken;
    const cookieToken = req.cookies.refreshToken;

    if (!bodyToken && !cookieToken) {
      return res.status(400).json({
        error: "Validation failed",
        details: [{ msg: "Refresh token is required", path: "refreshToken" }],
      });
    }

    next();
  },

  handleValidationErrors,
];

/**
 * Email verification validation rules
 */
export const validateEmailVerification = [
  body("token")
    .isLength({ min: 32, max: 256 })
    .withMessage("Invalid verification token format")
    .isHexadecimal()
    .withMessage("Verification token must be a valid hexadecimal string"),
  handleValidationErrors,
];

/**
 * Resend verification email validation rules
 */
export const validateResendVerification = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  handleValidationErrors,
];
