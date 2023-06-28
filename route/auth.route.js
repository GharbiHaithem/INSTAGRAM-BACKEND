const express = require('express')

const router = express.Router()
const {createUser,loginUser,forgotPasswordToken} = require('../controller/userCtr')
router.post('/create',createUser)
router.post('/login',loginUser)
router.post('/forgot-password',forgotPasswordToken)

module.exports = router