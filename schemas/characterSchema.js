const Joi = require("joi");

const characterSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().integer().positive().required(),
  weight: Joi.number().required(),
  story: Joi.string().required(),
});

module.exports = characterSchema;
