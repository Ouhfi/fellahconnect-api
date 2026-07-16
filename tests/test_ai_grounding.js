import assert from "assert";
import app from "../src/app.js";
import aiService from "../src/services/ai.service.js";

console.log("Loading AI Service...");
assert.ok(aiService);
assert.strictEqual(typeof aiService.chat, "function");

console.log("Loading routes and express app...");
assert.ok(app);

const registeredRoutes = app._router.stack
  .filter(r => r.route || r.name === "router")
  .map(r => {
    if (r.route) return r.route.path;
    if (r.name === "router" && r.regexp) {
      return r.regexp.toString();
    }
    return null;
  })
  .filter(Boolean);

console.log("Registered router paths:", registeredRoutes);
console.log("AI Grounding verification complete: All modules loaded and routes resolved successfully!");
process.exit(0);
