const express=  require('express')
const {createChat,userChat,findchat} = require('../controller/chatCtrl')
const router = express.Router()
router.post('/create-chat',createChat)
router.get('/findchat/:firstId/:secondId',findchat)
router.get('/chat/:userId',userChat)

module.exports = router