import ApiResponse from "../utils/apiResponse.js";

export function restrictTo(...roles) {
  return function (req, res, next) {
    if (!req.user) {
      return ApiResponse.error(res, "User context not found. Authentication required.", 401);
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.error(res, "You do not have permission to perform this action", 403);
    }

    next();
  };
}
