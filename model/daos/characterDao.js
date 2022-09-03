const Character = require("../models/characterModel");

const createNewCharacter = async (newCharacter) => {
  try {
    return await Character.create(newCharacter);
  } catch (e) {
    console.log(e);
  }
};

const getAllCharacters = async () => {
  try {
    const characters = await Character.findAll({
      attributes: ["image", "name"],
    });
    return characters;
  } catch (e) {
    console.log(e);
  }
};

const getFilteredCharacters = async (filters) => {
  try {
    const characters = await Character.findAll({
      where: filters,
    });
    return characters;
  } catch (e) {
    console.log(e);
  }
};

const updateCharacterById = async (characterId, newCharacter) => {
  try {
    return await Character.update(newCharacter, {
      where: {
        id: characterId,
      },
    });
  } catch (e) {
    console.log(e);
    return [ -1 ]
  }
};

module.exports = {
  createNewCharacter,
  getAllCharacters,
  getFilteredCharacters,
  updateCharacterById,
};
