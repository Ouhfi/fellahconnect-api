import logger from "../utils/logger.js";
import env from "./env.js";

const apiKey = env.DEEPSEEK_API;
const baseUrl = "https://api.deepseek.com/chat/completions";
const model = "deepseek-chat";

if (!apiKey) {
  logger.warn("DEEPSEEK_API key is not defined in the environment. DeepSeek AI features will be disabled.");
} else {
  logger.info("DeepSeek AI client configured successfully.");
}

export default {
  apiKey,
  baseUrl,
  model,
};
