import db from "../models/index.js";
import { Op } from "sequelize";
import deepSeekConfig from "../config/deepSeek.js";
import logger from "../utils/logger.js";

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

// DeepSeek tool definitions
const tools = [
  {
    type: "function",
    function: {
      name: "searchProducts",
      description: "Search for products (like tomatoes, potatoes, oranges) in the database to resolve their ID.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The product name to search for (e.g. 'tomato' or 'potato')."
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "searchMarkets",
      description: "Search for wholesale or local markets in Morocco to resolve their ID.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The market name or city to search for (e.g. 'Casablanca' or 'Agadir')."
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getCurrentMarketPrices",
      description: "Get current market prices for a specific product and/or market.",
      parameters: {
        type: "object",
        properties: {
          productId: {
            type: "integer",
            description: "The unique ID of the product."
          },
          marketId: {
            type: "integer",
            description: "The unique ID of the market."
          },
          quality: {
            type: "string",
            description: "The quality grade of the product (e.g. 'A', 'B')."
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getBestMarketForProduct",
      description: "Find the markets offering the highest prices for a specific product.",
      parameters: {
        type: "object",
        properties: {
          productId: {
            type: "integer",
            description: "The unique ID of the product."
          },
          quality: {
            type: "string",
            description: "The quality grade of the product (e.g. 'A')."
          }
        },
        required: ["productId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getPriceHistory",
      description: "Get historical price trends for a product in a market to analyze price changes over time.",
      parameters: {
        type: "object",
        properties: {
          productId: {
            type: "integer",
            description: "The unique ID of the product."
          },
          marketId: {
            type: "integer",
            description: "The unique ID of the market."
          },
          quality: {
            type: "string",
            description: "The quality grade of the product (e.g. 'A')."
          }
        },
        required: ["productId", "marketId"]
      }
    }
  }
];

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

    // Build the messages list with the custom system prompt
    const systemMessage = {
      role: "system",
      content: `You are FellahConnect AI, a smart agriculture assistant for Moroccan farmers.
Your core task is to assist users with checking product prices, comparing market options, analyzing historical price trends, and determining where they can sell their produce for the highest profit.

CRITICAL INSTRUCTIONS:
1. Always resolve product names (e.g. 'tomato', 'potato', 'orange') and market/city names (e.g. 'Casablanca', 'Agadir') using 'searchProducts' and 'searchMarkets' tools first to obtain their database IDs. Do not guess IDs.
2. Ground all answers in real database information retrieved via tools. If no price data exists for a query, state it clearly.
3. When compared prices are requested (e.g. "which market is best?"), compare the rates across all returned markets:
   - Identify the market offering the HIGHEST price.
   - List other markets and show the price difference so the farmer understands the potential gains.
4. Respond in a friendly, helpful, and professional tone.
5. Translate the final response to Moroccan Darija, French, or English as requested by the user. If they write in Darija, respond in Darija.`
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
