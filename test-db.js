
const { Sequelize } = require('sequelize');
const config = require('./src/config/database.js').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  logging: console.log,
});

async function run() {
  console.log('Testing connection to database at:', config.host, 'port:', config.port);
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to the database.');
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

run();