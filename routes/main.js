const express = require('express')
const router = express.Router()

const characterRouter = require('./characterRouter')
const movieRouter = require('./movieRouter')
const genreRouter = require('./genreRouter')

router.use('/characters', characterRouter)
router.use('/movies', movieRouter)
router.use('/genres', genreRouter)

module.exports = router