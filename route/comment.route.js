const express = require('express');
const { createComment} = require('../controller/commentCtrl');
const { authMiddleware } = require('../config/authMiddware');
const router = express.Router();
router.post(`/comment`,authMiddleware,createComment)
// router.patch(`/comment/:id`,requiredSignIn,updateComment)
// router.patch(`/comment/like/:id`,requiredSignIn,likeComment)
// router.patch(`/comment/unlike/:id`,requiredSignIn,unlikeComment)
// router.delete(`/comment/delete/:id`,requiredSignIn,deleteComment)
module.exports=router 