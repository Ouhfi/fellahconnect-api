const { User, Farmer, sequelize } = require("../models");
const ApiResponse = require("../utils/apiResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here";

/**
 * Register a new user (and farmer profile if role is farmer)
 */
async function register(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const { username, email, password, role = "farmer", firstName, lastName, phone, city, region } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [sequelize.Sequelize.Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      await transaction.rollback();
      return ApiResponse.error(res, "Username or Email already registered", 400);
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role
    }, { transaction });

    // If role is farmer, require farmer profile info and create it
    if (role === "farmer") {
      if (!firstName || !lastName || !phone || !city || !region) {
        await transaction.rollback();
        return ApiResponse.error(res, "Farmer profile fields (firstName, lastName, phone, city, region) are required for farmer registration", 400);
      }

      await Farmer.create({
        userId: user.id,
        firstName,
        lastName,
        phone,
        city,
        region
      }, { transaction });
    }

    await transaction.commit();

    // Sign JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d"
    });

    return ApiResponse.success(res, "User registered successfully", {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }, 201);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}

/**
 * Log in a user
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Farmer,
          as: "farmer"
        }
      ]
    });

    if (!user) {
      return ApiResponse.error(res, "Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return ApiResponse.error(res, "Invalid email or password", 401);
    }

    if (!user.isActive) {
      return ApiResponse.error(res, "User account is deactivated", 403);
    }

    // Sign JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d"
    });

    return ApiResponse.success(res, "Logged in successfully", {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        farmerProfile: user.farmer
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current logged in user details
 */
async function getMe(req, res, next) {
  try {
    return ApiResponse.success(res, "User details retrieved", {
      user: req.user
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe,
};
