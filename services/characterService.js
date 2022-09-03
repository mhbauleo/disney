const characterDao = require("../model/daos/characterDao");

const createNewCharacter = async (newCharacter) => {
  return await characterDao.createNewCharacter(newCharacter);
};

const getCharacters = async (query) => {
  const isEmpty = Object.keys(query).length === 0;
  if (isEmpty) {
    const characters = await characterDao.getAllCharacters();
    return characters;
  } else {
    const characters = await characterDao.getFilteredCharacters(query);
    return characters;
  }
};

module.exports = { createNewCharacter, getCharacters };
