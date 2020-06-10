const express = require('express')
const router = express.Router()

const { loginUser, createUser } = require('../controllers/user')

router.post('/signup', createUser)

router.post('/login', loginUser)

module.exports = router
