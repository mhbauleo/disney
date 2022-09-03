const characterService = require("../services/characterService");

const createNewCharacter = async (req, res) => {
    console.log('here')
  console.log(req.file);
  const image = req.file.path;
  const { name, age, weight, story } = req.body;
  const response = await characterService.createNewCharacter({
    image,
    name,
    age,
    weight,
    story,
  });
  res.json(response);
};

const getAllCharacters = async (req, res) => {
  const characters = await characterService.getCharacters(req.query);
  res.json(characters);
};

module.exports = { createNewCharacter, getAllCharacters };
