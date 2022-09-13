const Genre = require("../models/genreModel");

async function initGenres() {
  try {
    const genres = await Genre.findAll();
    if (genres.length === 0) {
      await Genre.create({ name: "comedy", image: "images/genres/comedy.jpg" });
      await Genre.create({ name: "action", image: "images/genres/action.jpeg" });
      await Genre.create({ name: "crime", image: "images/genres/crime.jpg" });
      await Genre.create({ name: "musical", image: "images/genres/musical.jpg" });
      await Genre.create({ name: "drama", image: "images/genres/drama.jpeg" });
      await Genre.create({ name: "adventure", image: "images/genres/adventure.jpg" });
      await Genre.create({ name: "tragedy", image: "images/genres/tragedy.jpg" });
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = { initGenres };
