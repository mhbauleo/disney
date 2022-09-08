const characterSchema = require("../schemas/characterSchema");
const movieSchema = require("../schemas/movieSchema");
const userSchema = require("../schemas/userSchema");
const characterQuerySchema = require("../schemas/characterQuerySchema");
const movieQuerySchema = require("../schemas/movieQuerySchema");

const joiValidator = (req, res, next, joiSchema) => {
  const { error } = joiSchema.validate(req.body);
  error
    ? res.status(422).json({
        status: "fail",
        data: { message: error.details[0].message },
      })
    : next();
};

const joiValidatorQueryParams = (req, res, next, joiSchema) => {
  const { error } = joiSchema.validate(req.query);
  error
    ? res.status(400).json({
        status: "fail",
        data: { message: error.details[0].message },
      })
    : next();
};

const characterJoiValidator = (req, res, next) => {
  joiValidator(req, res, next, characterSchema);
};

const movieJoiValidator = (req, res, next) => {
  joiValidator(req, res, next, movieSchema);
};

const userJoiValidator = (req, res, next) => {
  joiValidator(req, res, next, userSchema);
};

const characterQueryValidator = (req, res, next) => {
  joiValidatorQueryParams(req, res, next, characterQuerySchema);
};

const movieQueryValidator = (req, res, next) => {
  joiValidatorQueryParams(req, res, next, movieQuerySchema);
};

module.exports = {
  characterJoiValidator,
  movieJoiValidator,
  userJoiValidator,
  characterQueryValidator,
  movieQueryValidator,
};
