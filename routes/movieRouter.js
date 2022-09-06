const express = require('express')
const router = express.Router()

const movieController = require('../controllers/movieController')

const upload = require('../middlewares/multer')
const { auth } = require('../middlewares/auth')

router.post('/', auth, upload, movieController.createNewMovie)
router.get('/', auth, movieController.getAllMovies)
router.get('/:id', auth, movieController.getMovieDetails)
router.put('/:id', auth, upload, movieController.updateMovieById)
router.delete('/:id', auth, movieController.deleteMovieById)

module.exports = router