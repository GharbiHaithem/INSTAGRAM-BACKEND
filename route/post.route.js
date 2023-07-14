const express = require('express')
const router = express.Router()
const {authMiddleware} = require('../config/authMiddware')
const {deletePost,createPost,getAllPosts,likeDislikePost} = require('../controller/postCtrl')
router.post('/create/post',authMiddleware,createPost)
router.get('/getAllPosts',getAllPosts)
router.put('/likedislike/post/:id',authMiddleware,likeDislikePost)
router.delete('/delete/post/:id',authMiddleware,deletePost)
module.exports = router