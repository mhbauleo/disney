const Genre = require("../models/genreModel");

const getAllGenres = async () => {
  try {
    return await Genre.findAll();
  } catch (e) {
    console.log(e);
  }
};

module.exports = { getAllGenres };
