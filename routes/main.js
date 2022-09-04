const express = require('express')
const router = express.Router()

const characterRouter = require('./characterRouter')
const movieRouter = require('./movieRouter')

router.use('/characters', characterRouter)
router.use('/movies', movieRouter)

module.exports = router