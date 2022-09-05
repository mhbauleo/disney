const express = require('express')
const router = express.Router()

const characterController = require('../controllers/characterController')

const upload = require('../middlewares/multer')

router.post('/', upload, characterController.createNewCharacter)
router.get('/', characterController.getAllCharacters)
router.get('/:id', characterController.getCharacterDetails)
router.put('/:id', upload, characterController.updateCharacterById)
router.delete('/:id', upload, characterController.deleteCharacterById)

module.exports = router