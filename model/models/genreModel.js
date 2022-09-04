const Sequelize = require("sequelize");
const db = require("../db/database");

const Genre = db.define(
  "genre",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  }
);

module.exports = Genre;
