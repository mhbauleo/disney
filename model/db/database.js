const { Sequelize } = require("sequelize");

const dbConfig = require("../../config/dbConfig");

const db = new Sequelize(dbConfig.DB_NAME, dbConfig.DB_USER, dbConfig.DB_PASSWORD, {
  host: dbConfig.DB_HOST,
  dialect: dbConfig.DIALECT,
});

module.exports = db;
