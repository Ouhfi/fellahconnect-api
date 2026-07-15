const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const logger = require("./utils/logger");

const app = express();

app.use(helmet());
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: { write: (message) => logger.http(message.trim()) },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "FellahConnect API is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Route Registrations
app.use("/api/market-prices", require("./routes/marketPrice.routes"));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
