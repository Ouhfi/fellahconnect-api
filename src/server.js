require("dotenv").config();

const app = require("./app");
const db = require("./models");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    
    await db.sequelize.authenticate();
    console.log(" Database connected successfully.");

    
    await db.sequelize.sync();

    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Database connection failed:");
    console.error(error);
    process.exit(1);
  }
}

startServer();