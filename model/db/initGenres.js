const Genre = require("../models/genreModel");

async function initGenres() {
  try {
    const genres = await Genre.findAll();
    if (genres.length === 0) {
      await Genre.create({ name: "comedy", image: "comedy.jpeg" });
      await Genre.create({ name: "action", image: "action.jpeg" });
      await Genre.create({ name: "crime", image: "crime.jpeg" });
      await Genre.create({ name: "musical", image: "musical.jpeg" });
      await Genre.create({ name: "drama", image: "drama.jpeg" });
      await Genre.create({ name: "adventure", image: "adventure.jpeg" });
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = { initGenres };
