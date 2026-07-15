const ApiResponse = require("../utils/apiResponse");
const logger = require("../utils/logger");

/**
 * Centralized error-handling middleware
 */
function errorHandler(err, req, res, next) {
  // Log error using Winston logger
  logger.error(`${err.message} \nStack: ${err.stack}`);

  // Sequelize Unique Constraint Error
  if (err.name === "SequelizeUniqueConstraintError") {
    const errors = err.errors.map(function (e) {
      return {
        field: e.path,
        message: `${e.path} must be unique. Value already exists.`
      };
    });
    return ApiResponse.error(res, "Unique constraint violation", 409, errors);
  }

  // Sequelize ValidationError
  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.map(function (e) {
      return {
        field: e.path,
        message: e.message
      };
    });
    return ApiResponse.error(res, "Database validation failed", 400, errors);
  }

  // JWT JSON Web Token Errors
  if (err.name === "JsonWebTokenError") {
    return ApiResponse.error(res, "Invalid authentication token. Access denied.", 401);
  }

  if (err.name === "TokenExpiredError") {
    return ApiResponse.error(res, "Authentication token has expired. Please log in again.", 401);
  }

  // General server error fallback
  const statusCode = err.status || 500;
  const message = err.message || "Internal server error";

  return ApiResponse.error(res, message, statusCode, process.env.NODE_ENV === "development" ? err.stack : null);
}

module.exports = errorHandler;
