const Sequelize = require("sequelize");
const Character = require("./characterModel")
const Movie = require("./movieModel");
const db = require("../db/database");

const CharacterMovie = db.define(
  "character_movie",
  {
    movie_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Movie,
            key: 'id'
        }
    },
    character_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Character,
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

Character.belongsToMany(Movie, { through: CharacterMovie });
Movie.belongsToMany(Character, { through: CharacterMovie });

module.exports = CharacterMovie;
