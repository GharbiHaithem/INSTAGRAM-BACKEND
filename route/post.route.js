const express = require('express')
const router = express.Router()
const {authMiddleware} = require('../config/authMiddware')
const {createPost,getAllPosts,likePost,dislikePost} = require('../controller/postCtrl')
router.post('/create/post',authMiddleware,createPost)
router.get('/getAllPosts',getAllPosts)
router.put('/like/post/:id',authMiddleware,likePost)
router.put('/dislike/post/:id',authMiddleware,dislikePost)
module.exports = router