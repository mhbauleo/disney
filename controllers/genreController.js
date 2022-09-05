const genreService = require("../services/genreService");

const getAllGenres = async (req, res) => {
  const genres = await genreService.getAllGenres();
  res.json({ status: "success", data: genres });
};

module.exports = { getAllGenres };
