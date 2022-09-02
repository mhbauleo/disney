const dotenv = require("dotenv");
dotenv.config();

const dbConfig = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DIALECT: process.env.DIALECT,
};

module.exports = dbConfig;
