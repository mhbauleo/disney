const Sequelize = require("sequelize");
const db = require("../db/database");

const Character = db.define("character", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  weight: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  story: {
    type: Sequelize.STRING,
    allowNull: false,
  },
},
{
  freezeTableName: true,
  timestamps: false,
  underscored: true
});

module.exports = Character;