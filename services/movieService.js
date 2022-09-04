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

const getMovies = async (query) => {
    const isEmpty = Object.keys(query).length === 0;
    if (isEmpty) {
      const movies = await movieDao.getAllMovies();
      return movies;
    } else {
      const movies = await movieDao.getFilteredMovies(query);
      return movies;
    }
  };

module.exports = { createNewMovie, getMovies };
