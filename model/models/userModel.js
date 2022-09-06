const Sequelize = require("sequelize");
const db = require("../db/database");

const User = db.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  }
},
{
  freezeTableName: true,
  timestamps: false,
  underscored: true
});

module.exports = User;