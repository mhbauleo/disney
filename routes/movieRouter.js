const express = require('express')
const router = express.Router()

const movieController = require('../controllers/movieController')

const upload = require('../middlewares/multer')

router.post('/', upload, movieController.createNewMovie)

module.exports = router