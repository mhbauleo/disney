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

const getMovieDetails = async (movieId) => {
    return await movieDao.getMovieDetails(movieId)
}

const updateMovieById = async (movieId, newMovie) => {
    const [ count ] = await movieDao.updateMovieById(movieId, newMovie)
    return count
  }

const deleteMovieById = async (movieId) => {
    return await movieDao.deleteMovieById(movieId)
  }

module.exports = { createNewMovie, getMovies, getMovieDetails, updateMovieById, deleteMovieById };
