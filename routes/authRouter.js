const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')

const { userJoiValidator } = require("../middlewares/joiValidator")

router.post('/login', userJoiValidator, authController.login)
router.post('/register', userJoiValidator, authController.register)

module.exports = router