import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

import defineUser from "./User.js";
import defineFarmer from "./Farmer.js";
import defineProduct from "./Product.js";
import defineLandPlot from "./LandPlot.js";
import defineHarvest from "./Harvest.js";
import defineMarket from "./Market.js";
import defineMarketPrice from "./MarketPrice.js";
import defineSaleOffer from "./SaleOffer.js";
import setupAssociations from "./associations.js";

const db = {
  User: defineUser(sequelize, DataTypes),
  Farmer: defineFarmer(sequelize, DataTypes),
  Product: defineProduct(sequelize, DataTypes),
  LandPlot: defineLandPlot(sequelize, DataTypes),
  Harvest: defineHarvest(sequelize, DataTypes),
  Market: defineMarket(sequelize, DataTypes),
  MarketPrice: defineMarketPrice(sequelize, DataTypes),
  SaleOffer: defineSaleOffer(sequelize, DataTypes),
};

setupAssociations(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { sequelize, Sequelize };
export default db;