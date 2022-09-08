const Joi = require("joi");

const characterSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().integer().min(0).required(),
  weight: Joi.number().min(0).required(),
  story: Joi.string().required(),
});

module.exports = characterSchema;
