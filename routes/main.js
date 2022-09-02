const express = require('express')
const router = express.Router()

const characterRouter = require('./characterRouter')

router.use('/characters', characterRouter)

module.exports = router