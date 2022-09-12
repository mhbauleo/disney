const Movie = require("./movieModel");
const Genre = require("./genreModel");
const { db, DataTypes} = require("../db/database");

const MovieGenre = db.define(
  "movie_genre",
  {
    movie_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Movie,
            key: 'id'
        }
    },
    genre_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Genre,
            key: 'id'
        }
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  }
);

Genre.belongsToMany(Movie, { through: MovieGenre });
Movie.belongsToMany(Genre, { through: MovieGenre });

module.exports = MovieGenre;
