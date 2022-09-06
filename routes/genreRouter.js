const express = require('express')
const router = express.Router()

const genreController = require('../controllers/genreController')

const { auth } = require('../middlewares/auth')

router.get('/', auth, genreController.getAllGenres)

module.exports = router