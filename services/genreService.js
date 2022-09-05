const genreDao = require("../model/daos/genreDao");

const getAllGenres = async () => {
  return await genreDao.getAllGenres();
};

module.exports = { getAllGenres };
