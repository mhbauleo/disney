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

module.exports = {
  createNewMovie,
};
