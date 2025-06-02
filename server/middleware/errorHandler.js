/**
 * Error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error("Error details:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
  });

  // Default error response
  let error = {
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  };

  let statusCode = 500;

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = 400;
    error = {
      error: "Validation error",
      details: err.details || err.message,
    };
  } else if (
    err.name === "UnauthorizedError" ||
    err.message.includes("unauthorized")
  ) {
    statusCode = 401;
    error = {
      error: "Unauthorized",
      message: "Invalid or expired token",
    };
  } else if (
    err.name === "CastError" ||
    err.message.includes("invalid input syntax")
  ) {
    statusCode = 400;
    error = {
      error: "Bad request",
      message: "Invalid data format",
    };
  } else if (err.code === "23505") {
    // PostgreSQL unique constraint violation
    statusCode = 409;
    error = {
      error: "Conflict",
      message: "Resource already exists",
    };
  } else if (err.code === "23503") {
    // PostgreSQL foreign key constraint violation
    statusCode = 400;
    error = {
      error: "Bad request",
      message: "Referenced resource does not exist",
    };
  } else if (err.code === "23502") {
    // PostgreSQL not null constraint violation
    statusCode = 400;
    error = {
      error: "Bad request",
      message: "Required field is missing",
    };
  } else if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 413;
    error = {
      error: "File too large",
      message: "Uploaded file exceeds size limit",
    };
  } else if (err.type === "entity.parse.failed") {
    statusCode = 400;
    error = {
      error: "Bad request",
      message: "Invalid JSON format",
    };
  }

  // Rate limiting errors
  if (err.status === 429) {
    statusCode = 429;
    error = {
      error: "Too many requests",
      message: "Rate limit exceeded",
      retryAfter: err.retryAfter,
    };
  }

  // CORS errors
  if (err.message && err.message.includes("CORS")) {
    statusCode = 403;
    error = {
      error: "CORS error",
      message: "Origin not allowed",
    };
  }

  res.status(statusCode).json(error);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.method} ${req.url} not found`,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Async error wrapper
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Database error handler
 */
export const handleDatabaseError = (error) => {
  console.error("Database error:", error);

  if (error.code === "ECONNREFUSED") {
    throw new Error("Database connection failed");
  } else if (error.code === "28P01") {
    throw new Error("Database authentication failed");
  } else if (error.code === "3D000") {
    throw new Error("Database does not exist");
  } else {
    throw new Error("Database operation failed");
  }
};

export default {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  handleDatabaseError,
};
