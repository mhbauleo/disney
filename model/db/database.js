const { Sequelize, DataTypes } = require("sequelize");

const dbConfig = require("../../config/dbConfig");

const sequelizeConfig = {
  host: dbConfig.DB_HOST,
  dialect: dbConfig.DIALECT,
};

if(dbConfig.DIALECT === 'postgres') {
  sequelizeConfig.dialectOptions = {ssl: {rejectUnauthorized: false}}
}
if (process.env.NODE_ENV === "test") {
  sequelizeConfig.logging = false;
}

const db = new Sequelize(
  dbConfig.DB_NAME,
  dbConfig.DB_USER,
  dbConfig.DB_PASSWORD,
  sequelizeConfig
);

module.exports = { db, DataTypes };
