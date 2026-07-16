import aiService from "../services/ai.service.js";
import ApiResponse from "../utils/apiResponse.js";

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

      return ApiResponse.success(res, "AI response generated successfully", result, 200);
    } catch (error) {
      next(error);
    }
  }
}

export default new AIController();
