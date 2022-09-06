const express = require('express')
const router = express.Router()

const characterController = require('../controllers/characterController')

const upload = require('../middlewares/multer')
const { auth } = require('../middlewares/auth')

router.post('/', auth, upload, characterController.createNewCharacter)
router.get('/', auth, characterController.getAllCharacters)
router.get('/:id', auth, characterController.getCharacterDetails)
router.put('/:id', auth, upload, characterController.updateCharacterById)
router.delete('/:id', auth, upload, characterController.deleteCharacterById)

module.exports = router