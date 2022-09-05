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

const getCharacterDetails = async (characterId) => {
  return await characterDao.getCharacterDetails(characterId)
}

const updateCharacterById = async (characterId, newCharacter) => {
  const [ count ] = await characterDao.updateCharacterById(characterId, newCharacter)
  return count
}

const deleteCharacterById = async (characterId) => {
  return await characterDao.deleteCharacterById(characterId)
}

module.exports = { createNewCharacter, getCharacters, getCharacterDetails, updateCharacterById, deleteCharacterById };
