import aiService from "../services/ai.service.js";
import ApiResponse from "../utils/apiResponse.js";
import db from "../models/index.js";

const { Message } = db;

class AIController {
  /**
   * Handle grounding chat prompt
   */
  async chat(req, res, next) {
    try {
      const { prompt, history = [] } = req.body;

      if (!prompt) {
        return ApiResponse.error(res, "Prompt is required", 400);
      }

      const result = await aiService.chat(prompt, history);

      // Save the message and date of sending from user
      if (req.user && req.user.id) {
        await Message.create({
          userId: req.user.id,
          prompt: prompt,
          response: result.response,
        });
      }

      return ApiResponse.success(res, "AI response generated successfully", result, 200);
    } catch (error) {
      next(error);
    }
  }
}

export default new AIController();
