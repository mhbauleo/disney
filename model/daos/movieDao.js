const { Op } = require("sequelize");
const Movie = require("../models/movieModel");
const Genre = require("../models/genreModel");
const Character = require("../models/characterModel");

const createNewMovie = async (newMovie) => {
  try {
    const { image, title, date, stars, characterIds, genres } = newMovie;

    // Get genres and characters from database
    const movieGenres = await Genre.findAll({
      where: {
        name: {
          [Op.or]: genres,
        },
      },
    });
    const movieCharacters = await Character.findAll({
      where: {
        id: {
          [Op.or]: characterIds,
        },
      },
    });

    // Validate characters and genres
    const charactersOk = movieCharacters.length === characterIds.length;
    const genresOk = movieGenres.length === genres.length;
    if (!charactersOk || !genresOk) return null;

    // Create movie
    const createdMovie = await Movie.create({ image, title, date, stars });

    // Associations
    await createdMovie.addCharacters(movieCharacters);
    await createdMovie.addGenres(movieGenres);

    return createdMovie;
  } catch (e) {
    console.log(e);
  }
};

const getAllMovies = async () => {
  try {
    const movies = await Movie.findAll({
      attributes: ["image", "title", "date"],
    });
    return movies;
  } catch (e) {
    console.log(e);
  }
};

const buildQuery = (filters) => {
  const { title, stars, genre, order } = filters;
  const query = {};
  query.include = [{ model: Genre, through: {attributes: []} }];
  if (genre) {
    query.include[0].where = {
      id: genre,
    };
    query.include[0].required = true;
  }
  if (order) query.order = [["date", order]];
  if (title || stars) {
    const whereFilters = {};
    if (title) whereFilters.title = title;
    if (stars) whereFilters.stars = stars;
    query.where = whereFilters;
  }
  return query;
};

const getFilteredMovies = async (filters) => {
  try {
    const movies = await Movie.findAll(buildQuery(filters));
    return movies;
  } catch (e) {
    console.log(e);
  }
};

const getMovieDetails = async (movieId) => {
  try {
    return await Movie.findOne({
      where: {
        id: movieId,
      },
      include: [{ model: Character, through: {attributes: []} }, { model: Genre, through: {attributes: []} }],
    });
  } catch (e) {
    console.log(e);
  }
};

const updateMovieById = async (movieId, newMovie) => {
  try {
    const { image, title, date, stars, characterIds, genres } = newMovie;

    // Get genres and characters from database
    const movieGenres = await Genre.findAll({
      where: {
        name: {
          [Op.or]: genres,
        },
      },
    });
    const movieCharacters = await Character.findAll({
      where: {
        id: {
          [Op.or]: characterIds,
        },
      },
    });

    // Validate characters and genres
    const charactersOk = movieCharacters.length === characterIds.length;
    const genresOk = movieGenres.length === genres.length;
    if (!charactersOk || !genresOk) return [ -2 ];

    // Update movie
    const res = await Movie.update({ image, title, date, stars }, {
      where: {
        id: movieId,
      },
    });
    const updatedMovie = await Movie.findByPk(movieId)

    // Associations
    await updatedMovie.setCharacters(movieCharacters);
    await updatedMovie.setGenres(movieGenres);

    return res;
  } catch (e) {
    console.log(e);
    return [-1];
  }
};

const deleteMovieById = async (movieId) => {
  try {
    return await Movie.destroy({
      where: {
        id: movieId,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  createNewMovie,
  getAllMovies,
  getFilteredMovies,
  getMovieDetails,
  updateMovieById,
  deleteMovieById,
};
