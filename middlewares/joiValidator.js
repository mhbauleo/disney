const characterSchema = require("../schemas/characterSchema");
const movieSchema = require("../schemas/movieSchema");
const userSchema = require("../schemas/userSchema");

const joiValidator = (req, res, next, joiSchema) => {
  const { error } = joiSchema.validate(req.body);
  error
    ? res.status(422).json({
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

module.exports = { characterJoiValidator, movieJoiValidator, userJoiValidator };
