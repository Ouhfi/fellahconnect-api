import dotenv from "dotenv";
import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the environment variables from the root .env file
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Define the schema for the environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number({
    invalid_type_error: "PORT must be a number",
  }).default(3000),

  // Database Connection
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number({
    invalid_type_error: "DB_PORT must be a number",
  }).default(5432),
  DB_NAME: z.string({ required_error: "DB_NAME is required" }),
  DB_USER: z.string({ required_error: "DB_USER is required" }),
  DB_PASSWORD: z.string({ required_error: "DB_PASSWORD is required" }),

  // Auth Secret (Requires minimum 32 characters in production)
  JWT_SECRET: z.string().default("your_jwt_secret_key_here"),

  // DeepSeek / Gemini AI configuration (Optional or fallback to empty string)
  DEEPSEEK_API: z.string().optional().or(z.literal("")),
  GEMINI_API_KEY: z.string().optional().or(z.literal("")),

  // Pinecone Integration (Optional)
  PINECONE_API_KEY: z.string().optional().or(z.literal("")),
  PINECONE_INDEX_NAME: z.string().default("fellahconnect-index"),
  PINECONE_HOST: z.string().optional().or(z.literal("")),
});

// Perform validation
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables configuration:");
  console.error(JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}

export default parsedEnv.data;
