const characterService = require("../services/characterService");

const createNewCharacter = async (req, res) => {
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

const updateCharacterById = async (req, res) => {
  const image = req.file.path;
  const { name, age, weight, story } = req.body;
  const count = await characterService.updateCharacterById(req.params.id, {
    image,
    name,
    age,
    weight,
    story,
  })
  if(count === -1) return res.status(500).json({ status: "error", message: "Internal server error" })
  if(count > 0) {
    res.json({ status: "success", data: null })
  } else {
    res.status(404).json({ status: "fail", data : { "message" : "You couldn't update the character" } })
  }
}

const deleteCharacterById = async (req, res) => {
  const count = await characterService.deleteCharacterById(req.params.id)
  if(count > 0) {
    res.json({ status: "success", data: null })
  } else {
    res.status(404).json({ status: "fail", data : { "message" : "You couldn't delete the character" } })
  }
}

module.exports = { createNewCharacter, getAllCharacters, updateCharacterById, deleteCharacterById };
