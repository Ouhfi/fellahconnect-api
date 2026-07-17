import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { User, Farmer, sequelize } = db;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here";

class AuthService {
  /**
   * Generate JWT Token
   */
  generateToken(user, expiresIn = "7d") {
    return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn
    });
  }

  /**
   * Verify JWT Token
   */
  verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
  }

  /**
   * Register user and farmer profile
   */
  async register(userData) {
    const { username, email, password, role = "farmer", firstName, lastName, phone, city, region } = userData;

    const transaction = await sequelize.transaction();
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          [db.Sequelize.Op.or]: [{ email }, { username }]
        }
      });

      if (existingUser) {
        const err = new Error("Username or Email already registered");
        err.statusCode = 400;
        throw err;
      }

      // Create user
      const user = await User.create({
        username,
        email,
        password,
        role
      }, { transaction });

      // If role is farmer, create farmer profile
      if (role === "farmer") {
        if (!firstName || !lastName || !phone || !city || !region) {
          const err = new Error("Farmer profile fields (firstName, lastName, phone, city, region) are required");
          err.statusCode = 400;
          throw err;
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

      const token = this.generateToken(user);
      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Log in user
   */
  async login(email, password) {
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
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }

    if (!user.isActive) {
      const err = new Error("User account is deactivated");
      err.statusCode = 403;
      throw err;
    }

    const token = this.generateToken(user, "1h");
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        farmerProfile: user.farmer
      }
    };
  }
}

export default new AuthService();
