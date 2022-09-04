const movieDao = require("../model/daos/movieDao");

const createNewMovie = async (newCharacter) => {
  const { image, title, date, stars, characterIds, genres } = newCharacter;

  return await movieDao.createNewMovie({
    image,
    title,
    date,
    stars: Number(stars),
    characterIds: characterIds.map((id) => Number(id)),
    genres,
  });
};

module.exports = { createNewMovie };
