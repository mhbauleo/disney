const Joi = require("joi");

const movieSchema = Joi.object({
  title: Joi.string().required(),
  date: Joi.date().required(),
  stars: Joi.number().valid(1, 2, 3, 4, 5).required(),
  characterIds: Joi.array().items(Joi.number().integer().positive()).required(),
  genres: Joi.array().items(Joi.string()).required(),
});

module.exports = movieSchema;
