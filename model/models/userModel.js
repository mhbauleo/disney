const { db, DataTypes} = require("../db/database");

const User = db.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
},
{
  freezeTableName: true,
  timestamps: false,
  underscored: true
});

module.exports = User;