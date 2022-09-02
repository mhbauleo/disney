const Character = require("../models/characterModel");

const getAllCharacters = async () => {
  try {
    const characters = await Character.findAll({
      attributes: ["image", "name"],
    });
    return characters;
  } catch (e) {
    console.log(e)
  }
};

const getFilteredCharacters = async (filters) => {
  try {
    const characters = await Character.findAll({
      where: filters,
    });
    return characters;
  } catch (e) {
    console.log(e)
  }
};

module.exports = { getAllCharacters, getFilteredCharacters };
