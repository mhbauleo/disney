const movieService = require("../services/movieService");

const createNewMovie = async (req, res) => {
  const image = req.file.path;
  const { title, date, stars, characterIds, genres } = req.body;
  const movieCreated = await movieService.createNewMovie({
    image,
    title,
    date,
    stars,
    characterIds,
    genres,
  });
  movieCreated
    ? res.status(201).json({ status: "success", data: movieCreated })
    : res.status(422).json({
        status: "fail",
        data: { message: "Something went wrong" },
      });
};

module.exports = { createNewMovie };
