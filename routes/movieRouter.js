const express = require('express')
const router = express.Router()

const movieController = require('../controllers/movieController')

const upload = require('../middlewares/multer')
const { auth } = require('../middlewares/auth')
const { movieJoiValidator, movieQueryValidator } = require("../middlewares/joiValidator")

router.post('/', auth, upload, movieJoiValidator, movieController.createNewMovie)
router.get('/', auth, movieQueryValidator, movieController.getAllMovies)
router.get('/:id', auth, movieController.getMovieDetails)
router.put('/:id', auth, upload, movieJoiValidator, movieController.updateMovieById)
router.delete('/:id', auth, movieController.deleteMovieById)

module.exports = router