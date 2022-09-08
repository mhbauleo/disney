const express = require('express')
const router = express.Router()

const characterController = require('../controllers/characterController')

const upload = require('../middlewares/multer')
const { auth } = require('../middlewares/auth')
const { characterJoiValidator, characterQueryValidator } = require('../middlewares/joiValidator')

router.post('/', auth, upload, characterJoiValidator, characterController.createNewCharacter)
router.get('/', auth, characterQueryValidator, characterController.getAllCharacters)
router.get('/:id', auth, characterController.getCharacterDetails)
router.put('/:id', auth, upload, characterJoiValidator, characterController.updateCharacterById)
router.delete('/:id', auth, characterController.deleteCharacterById)

module.exports = router