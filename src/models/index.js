"use strict";

const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const basename = path.basename(__filename);
const db = {};


fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file !== "associations.js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });


if (fs.existsSync(path.join(__dirname, "associations.js"))) {
  require("./associations")(db);
}


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;