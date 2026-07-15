module.exports = (models) => {
  const {
    User,
    Farmer,
    LandPlot,
    Product,
    Harvest,
    Market,
    MarketPrice,
    SaleOffer,
  } = models;

  // User ↔ Farmer
  User.hasOne(Farmer, {
    foreignKey: "userId",
    as: "farmer",
  });

  Farmer.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // Farmer ↔ LandPlot
  Farmer.hasMany(LandPlot, {
    foreignKey: "farmerId",
    as: "landPlots",
  });

  LandPlot.belongsTo(Farmer, {
    foreignKey: "farmerId",
    as: "farmer",
  });

  // Farmer ↔ Harvest
  Farmer.hasMany(Harvest, {
    foreignKey: "farmerId",
    as: "harvests",
  });

  Harvest.belongsTo(Farmer, {
    foreignKey: "farmerId",
    as: "farmer",
  });

  // LandPlot ↔ Harvest
  LandPlot.hasMany(Harvest, {
    foreignKey: "landPlotId",
    as: "harvests",
  });

  Harvest.belongsTo(LandPlot, {
    foreignKey: "landPlotId",
    as: "landPlot",
  });

  // Product ↔ Harvest
  Product.hasMany(Harvest, {
    foreignKey: "productId",
    as: "harvests",
  });

  Harvest.belongsTo(Product, {
    foreignKey: "productId",
    as: "product",
  });

  // Product ↔ MarketPrice
  Product.hasMany(MarketPrice, {
    foreignKey: "productId",
    as: "marketPrices",
  });

  MarketPrice.belongsTo(Product, {
    foreignKey: "productId",
    as: "product",
  });

  // Market ↔ MarketPrice
  Market.hasMany(MarketPrice, {
    foreignKey: "marketId",
    as: "marketPrices",
  });

  MarketPrice.belongsTo(Market, {
    foreignKey: "marketId",
    as: "market",
  });

  // Farmer ↔ SaleOffer
  Farmer.hasMany(SaleOffer, {
    foreignKey: "farmerId",
    as: "saleOffers",
  });

  SaleOffer.belongsTo(Farmer, {
    foreignKey: "farmerId",
    as: "farmer",
  });

  // Harvest ↔ SaleOffer
  Harvest.hasMany(SaleOffer, {
    foreignKey: "harvestId",
    as: "saleOffers",
  });

  SaleOffer.belongsTo(Harvest, {
    foreignKey: "harvestId",
    as: "harvest",
  });

  // Market ↔ SaleOffer
  Market.hasMany(SaleOffer, {
    foreignKey: "marketId",
    as: "saleOffers",
  });

  SaleOffer.belongsTo(Market, {
    foreignKey: "marketId",
    as: "market",
  });
};