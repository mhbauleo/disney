const express = require('express')
const router = express.Router()

const movieController = require('../controllers/movieController')

const upload = require('../middlewares/multer')

router.post('/', upload, movieController.createNewMovie)
router.get('/', movieController.getAllMovies)
router.get('/:id', movieController.getMovieDetails)
router.delete('/:id', movieController.deleteMovieById)

module.exports = router