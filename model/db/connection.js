const db = require("./database");
const Movie = require("../models/movieModel")
const Genre = require("../models/genreModel")
const Character = require("../models/characterModel")
const MovieGenre = require("../models/movieGenreModel")
const CharacterMovie = require("../models/characterMovieModel")
const User = require("../models/userModel")

async function dbConnection() {
  try {
    await db.authenticate();
    console.log("Database online");
    await Character.sync()
    await Movie.sync()
    await Genre.sync()
    await MovieGenre.sync()
    await CharacterMovie.sync()
    await User.sync()
    console.log("Tables created")
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { dbConnection };
