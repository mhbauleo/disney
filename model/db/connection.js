const { db } = require("./database");
const { initGenres } = require("./initGenres")
const Movie = require("../models/movieModel")
const Genre = require("../models/genreModel")
const Character = require("../models/characterModel")
const MovieGenre = require("../models/movieGenreModel")
const CharacterMovie = require("../models/characterMovieModel")
const User = require("../models/userModel")

async function dbConnection() {
  try {
    await db.authenticate();
    await Character.sync()
    await Movie.sync()
    await Genre.sync()
    await MovieGenre.sync()
    await CharacterMovie.sync()
    await User.sync()
    await initGenres()
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { dbConnection };
