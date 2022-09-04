const Sequelize = require("sequelize");
const db = require("../db/database");

const Movie = db.define(
  "movie",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    stars: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  }
);

module.exports = Movie;
