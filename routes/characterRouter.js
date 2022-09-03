const express = require('express')
const router = express.Router()

const characterController = require('../controllers/characterController')

const upload = require('../middlewares/multer')

router.post('/', upload, characterController.createNewCharacter)
router.get('/', characterController.getAllCharacters)
router.put('/:id', upload, characterController.updateCharacterById)

module.exports = router