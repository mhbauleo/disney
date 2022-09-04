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

const getAllMovies = async (req, res) => {
  const movies = await movieService.getMovies(req.query);
  res.json({ status: "success", data: movies });
};

const getMovieDetails = async (req, res) => {
  const details = await movieService.getMovieDetails(req.params.id);
  details
    ? res.json({ status: "success", data: details })
    : res.status(404).json({
        status: "fail",
        data: { message: "Movie not found" },
      });
};

module.exports = { createNewMovie, getAllMovies, getMovieDetails };
