const { db, DataTypes} = require("../db/database");

const Character = db.define("character", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  story: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{
  freezeTableName: true,
  timestamps: false,
  underscored: true
});

module.exports = Character;