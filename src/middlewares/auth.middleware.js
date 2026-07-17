import authService from "../services/auth.service.js";
import db from "../models/index.js";
import ApiResponse from "../utils/apiResponse.js";

const { User, Farmer } = db;

export async function protect(req, res, next) {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return ApiResponse.error(res, "Not authorized, no token provided", 401);
    }

    // Verify token
    const decoded = authService.verifyToken(token);

    // Get user from database
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Farmer,
          as: "farmer",
        },
      ],
    });

    if (!user) {
      return ApiResponse.error(res, "Not authorized, user not found", 401);
    }

    if (!user.isActive) {
      return ApiResponse.error(res, "User account is deactivated", 403);
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.error(res, "Not authorized, token failed", 401);
  }
}
