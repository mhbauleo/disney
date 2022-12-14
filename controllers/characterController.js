const characterService = require("../services/characterService");

const createNewCharacter = async (req, res) => {
  const image = req.file?.path;
  if (!image)
    return res.status(422).json({
      status: "fail",
      data: { message: "image is required" },
    });

  const { name, age, weight, story } = req.body;
  const characterCreated = await characterService.createNewCharacter({
    image,
    name,
    age,
    weight,
    story,
  });
  res.status(201).json({ status: "success", data: characterCreated });
};

const getAllCharacters = async (req, res) => {
  const characters = await characterService.getCharacters(req.query);
  res.json({ status: "success", data: characters });
};

const getCharacterDetails = async (req, res) => {
  const details = await characterService.getCharacterDetails(req.params.id);
  details
    ? res.json({ status: "success", data: details })
    : res.status(404).json({
        status: "fail",
        data: { message: "Character not found" },
      });
};

const updateCharacterById = async (req, res) => {
  const image = req.file?.path;
  if (!image)
    return res.status(422).json({
      status: "fail",
      data: { message: "image is required" },
    });

  const { name, age, weight, story } = req.body;
  const count = await characterService.updateCharacterById(req.params.id, {
    image,
    name,
    age,
    weight,
    story,
  });
  if (count === -1)
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  if (count > 0) {
    res.json({ status: "success", data: null });
  } else {
    res.status(404).json({
      status: "fail",
      data: { message: "You couldn't update the character" },
    });
  }
};

const deleteCharacterById = async (req, res) => {
  const count = await characterService.deleteCharacterById(req.params.id);
  if (count > 0) {
    res.json({ status: "success", data: null });
  } else {
    res.status(404).json({
      status: "fail",
      data: { message: "You couldn't delete the character" },
    });
  }
};

module.exports = {
  createNewCharacter,
  getAllCharacters,
  getCharacterDetails,
  updateCharacterById,
  deleteCharacterById,
};
