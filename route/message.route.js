const express = require('express')
const{createMessage,getMessage} = require('../controller/messageCtrl')
const router = express.Router()
router.post('/createMessage',createMessage)
router.get('/getmessage/:chatId',getMessage)
module.exports = router 