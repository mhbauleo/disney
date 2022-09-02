const characterService = require("../services/characterService");

const getAllCharacters = async (req, res) => {
  const characters = await characterService.getCharacters(req.query);
  res.json(characters);
};

module.exports = { getAllCharacters };
