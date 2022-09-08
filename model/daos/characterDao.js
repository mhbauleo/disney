const Character = require("../models/characterModel");
const Movie = require("../models/movieModel");

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

const buildQuery = (filters) => {
  const { name, age, weight, movies } = filters;
  const query = {};
  query.include = [{ model: Movie, through: {attributes: []} }];
  
  if (movies) {
    query.include[0].where = {
      id: movies,
    };
    query.include[0].required = true;
  }

  const whereFilters = {};
  if (name) whereFilters.name = name;
  if (age) whereFilters.age = age;
  if (weight) whereFilters.weight = weight;
  query.where = whereFilters;

  return query;
};

const getFilteredCharacters = async (filters) => {
  try {
    const characters = await Character.findAll(buildQuery(filters));
    return characters;
  } catch (e) {
    console.log(e);
  }
};

const getCharacterDetails = async (characterId) => {
  try {
    return await Character.findOne({
      where: {
        id: characterId,
      },
      include: { model: Movie, through: {attributes: []} },
    });
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
    return [-1];
  }
};

const deleteCharacterById = async (characterId) => {
  try {
    return await Character.destroy({
      where: {
        id: characterId,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  createNewCharacter,
  getAllCharacters,
  getFilteredCharacters,
  getCharacterDetails,
  updateCharacterById,
  deleteCharacterById,
};
