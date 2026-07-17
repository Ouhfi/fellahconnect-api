import db from "../models/index.js";
import { Op } from "sequelize";
import { readFileSync } from "fs";
import deepSeekConfig from "../config/deepSeek.js";
import logger from "../utils/logger.js";
import vectorService from "./vector.service.js";

const { Product, Market, MarketPrice } = db;

// Helper database lookup functions
async function searchProducts(query) {
  return await Product.findAll({
    where: {
      name: { [Op.iLike]: `%${query}%` }
    },
    limit: 5,
    attributes: ["id", "name", "category", "unit"]
  });
}

async function searchMarkets(query) {
  return await Market.findAll({
    where: {
      name: { [Op.iLike]: `%${query}%` }
    },
    limit: 5,
    attributes: ["id", "name", "city", "region"]
  });
}

async function getCurrentMarketPrices(productId, marketId, quality) {
  const where = {};
  if (productId) where.productId = productId;
  if (marketId) where.marketId = marketId;
  if (quality) where.quality = quality;

  return await MarketPrice.findAll({
    where,
    include: [
      { model: Market, as: "market", attributes: ["name", "city"] },
      { model: Product, as: "product", attributes: ["name", "unit"] }
    ],
    order: [["priceDate", "DESC"], ["price", "ASC"]],
    limit: 10
  });
}

async function getBestMarketForProduct(productId, quality) {
  const prices = await MarketPrice.findAll({
    where: {
      productId,
      ...(quality && { quality })
    },
    include: [
      { model: Market, as: "market", attributes: ["name", "city"] },
      { model: Product, as: "product", attributes: ["name", "unit"] }
    ],
    order: [["price", "DESC"], ["priceDate", "DESC"]],
    limit: 5
  });
  return prices;
}

async function getPriceHistory(productId, marketId, quality) {
  const where = { productId, marketId };
  if (quality) where.quality = quality;

  return await MarketPrice.findAll({
    where,
    include: [
      { model: Market, as: "market", attributes: ["name", "city"] },
      { model: Product, as: "product", attributes: ["name", "unit"] }
    ],
    order: [["priceDate", "ASC"]],
    limit: 20
  });
}

// Load DeepSeek tool definitions from JSON file
const tools = JSON.parse(
  readFileSync(new URL("../config/deepSeekTools.json", import.meta.url), "utf-8")
);

class AIService {
  /**
   * Run a chat request against DeepSeek, grounding replies with tool executions.
   * @param {string} prompt The user's query.
   * @param {Array} history Conversation history messages.
   * @returns {Object} { response, history }
   */
  async chat(prompt, history = []) {
    if (!deepSeekConfig.apiKey) {
      throw new Error("DeepSeek API key is not configured.");
    }

    // Fetch the current date from the database
    let dbDate = "";
    try {
      const [result] = await db.sequelize.query("SELECT TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD') as date");
      dbDate = result[0]?.date || new Date().toISOString().split('T')[0];
    } catch (error) {
      logger.error("Failed to fetch date from database:", error);
      dbDate = new Date().toISOString().split('T')[0];
    }

    // Build the messages list with the custom system prompt
    const systemMessage = {
      role: "system",
      content: `You are FellahConnect AI, a smart agriculture assistant for Moroccan farmers.
Your core task is to assist users with checking product prices, comparing market options, analyzing historical price trends, determining where they can sell their produce for the highest profit, and providing expert agricultural advice (such as crop diseases, planting schedules, irrigation, and storage techniques).

Current Date (Database Time): ${dbDate}

CRITICAL INSTRUCTIONS:
1. Always resolve product names (e.g. 'tomato', 'potato', 'orange') and market/city names (e.g. 'Casablanca', 'Agadir') using 'searchProducts' and 'searchMarkets' tools first to obtain their database IDs. Do not guess IDs.
2. Ground all answers in real database or vector database information retrieved via tools. If no data exists for a query, state it clearly.
3. For agricultural guides, advice, diseases, or farming best practices, use the 'searchAgriculturalGuides' tool. Do not answer from general knowledge alone if a relevant guide can be retrieved.
4. When compared prices are requested (e.g. "which market is best?"), compare the rates across all returned markets:
   - Identify the market offering the HIGHEST price.
   - List other markets and show the price difference so the farmer understands the potential gains.
5. Respond in a friendly, helpful, and professional tone.
6. Translate the final response to Moroccan Darija, French, or English as requested by the user. If they write in Darija, respond in Darija (using Arabizi).
7. CRITICAL: You MUST ALWAYS respond using ONLY the Latin/English alphabet. You are STRICTLY FORBIDDEN from using any Arabic characters (e.g. do not write 'أحسن', use 'ahsan'; do not write 'الدار البيضاء', use 'Casablanca'; do not write 'بطاطس', use 'btata') under any circumstances. Transliterate all Arabic/Darija words into Latin script phonetically.`
    };

    const messages = [
      systemMessage,
      ...history,
      { role: "user", content: prompt }
    ];

    let loopCount = 0;
    const maxLoops = 5;
    let finalContent = "";

    while (loopCount < maxLoops) {
      const response = await fetch(deepSeekConfig.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${deepSeekConfig.apiKey}`
        },
        body: JSON.stringify({
          model: deepSeekConfig.model,
          messages: messages,
          tools: tools,
          tool_choice: "auto"
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error("DeepSeek API error response:", errorText);
        throw new Error(`DeepSeek API request failed: ${response.statusText} (${response.status})`);
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      const message = choice?.message;

      if (!message) {
        throw new Error("Invalid response structure from DeepSeek API.");
      }

      // Check if model wants to call tools
      if (message.tool_calls && message.tool_calls.length > 0) {
        logger.info(`DeepSeek requested ${message.tool_calls.length} tool calls.`);
        // Append the assistant message containing the tool calls
        messages.push(message);

        // Execute each tool call
        for (const toolCall of message.tool_calls) {
          const { name, arguments: argsString } = toolCall.function;
          const args = JSON.parse(argsString);

          logger.info(`Executing tool: ${name} with args:`, args);
          let result;

          try {
            if (name === "searchProducts") {
              result = await searchProducts(args.query);
            } else if (name === "searchMarkets") {
              result = await searchMarkets(args.query);
            } else if (name === "getCurrentMarketPrices") {
              result = await getCurrentMarketPrices(args.productId, args.marketId, args.quality);
            } else if (name === "getBestMarketForProduct") {
              result = await getBestMarketForProduct(args.productId, args.quality);
            } else if (name === "getPriceHistory") {
              result = await getPriceHistory(args.productId, args.marketId, args.quality);
            } else if (name === "searchAgriculturalGuides") {
              result = await vectorService.searchGuides(args.query);
            } else {
              result = { error: `Tool ${name} not found` };
            }
          } catch (error) {
            logger.error(`Error executing tool ${name}:`, error);
            result = { error: error.message };
          }

          // Push the tool execution response
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            name: name,
            content: JSON.stringify(result)
          });
        }

        loopCount++;
      } else {
        // No more tool calls, return final response
        finalContent = message.content;
        messages.push(message);
        break;
      }
    }

    // Filter out system message and return the updated conversation history
    const returnedHistory = messages.filter(m => m.role !== "system");

    return {
      response: finalContent,
      history: returnedHistory
    };
  }
}

export default new AIService();
