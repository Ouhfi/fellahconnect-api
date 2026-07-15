const jwt = require("jsonwebtoken");
const { User, Farmer } = require("../models");
const ApiResponse = require("../utils/apiResponse");

const protect = async (req, res, next) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key_here");

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
};

module.exports = { protect };
