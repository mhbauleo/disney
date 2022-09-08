const Joi = require("joi");

const characterQuerySchema = Joi.object({
  name: Joi.string(),
  age: Joi.number().integer().min(0),
  weight: Joi.number().min(0),
  movies: Joi.alternatives().try(Joi.number().integer().positive(), Joi.array().items(Joi.number().integer().positive()))
});

module.exports = characterQuerySchema;
