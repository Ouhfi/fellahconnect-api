import authService from "../services/auth.service.js";
import ApiResponse from "../utils/apiResponse.js";

class AuthController {
  /**
   * Register a new user (and farmer profile if role is farmer)
   */
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      return ApiResponse.success(res, "User registered successfully", result, 201);
    } catch (error) {
      if (error.statusCode) {
        return ApiResponse.error(res, error.message, error.statusCode);
      }
      next(error);
    }
  }

  /**
   * Log in a user
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return ApiResponse.success(res, "Logged in successfully", result);
    } catch (error) {
      if (error.statusCode) {
        return ApiResponse.error(res, error.message, error.statusCode);
      }
      next(error);
    }
  }

  /**
   * Get current logged in user details
   */
  async getMe(req, res, next) {
    try {
      return ApiResponse.success(res, "User details retrieved", {
        user: req.user
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
