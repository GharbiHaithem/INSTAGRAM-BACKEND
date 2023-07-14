const express = require('express')
const {authMiddleware}  = require('../config/authMiddware')
const router = express.Router()
const {updateProfileUser,getUserbySearch,createUser,loginUser,forgotPasswordToken,unfollow,getalluser,getSussegtionUser,follow,refreshUser,getOneUser} = require('../controller/userCtr')
router.post('/create',createUser)
router.post('/login',loginUser)
router.post('/forgot-password',forgotPasswordToken)
router.get('/searchUser',authMiddleware,getUserbySearch)
router.get('/suggest-user',authMiddleware,getSussegtionUser)
router.get('/getallusers',getalluser)
router.get('/refreshuser',authMiddleware,refreshUser)
router.get('/user/:id',getOneUser)
router.put('/follow/:id',authMiddleware,follow)
router.put('/unfollow/:id',authMiddleware,unfollow)
router.put('/updateProfile',authMiddleware,updateProfileUser)


module.exports = router