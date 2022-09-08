const Joi = require("joi");

const movieQuerySchema = Joi.object({
  title: Joi.string(),
  stars: Joi.number().valid(1, 2, 3, 4, 5),
  genre: Joi.alternatives().try(
    Joi.number().integer().positive(),
    Joi.array().items(Joi.number().integer().positive())
  ),
  order: Joi.string().valid("ASC", "DESC", "asc", "desc"),
});

module.exports = movieQuerySchema;
