import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import logger from "./utils/logger.js";
import authRoutes from "./routes/auth.routes.js";
import farmerRoutes from "./routes/farmer.routes.js";
import productRoutes from "./routes/product.routes.js";
import landPlotRoutes from "./routes/landPlot.routes.js";
import harvestRoutes from "./routes/harvest.routes.js";
import marketRoutes from "./routes/market.routes.js";
import saleOfferRoutes from "./routes/saleOffer.routes.js";
import marketPriceRoutes from "./routes/marketPrice.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

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
app.use("/api/auth", authRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/land-plots", landPlotRoutes);
app.use("/api/harvests", harvestRoutes);
app.use("/api/markets", marketRoutes);
app.use("/api/sale-offers", saleOfferRoutes);
app.use("/api/market-prices", marketPriceRoutes);
app.use("/api/ai", aiRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;
