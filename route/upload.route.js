const express = require('express')
// const { authMiddleware, isAdmin } = require('../config/authMiddleware')
const {uploadImageCtrl} = require('../controller/uploadCtrl')
const {blogImgResize,uploadPhoto,productImgResize}  =require('../middlware/upload.image')
const router = express.Router()
router.put('/upload',uploadPhoto.array('images',10),productImgResize,uploadImageCtrl.uploadImages)
router.delete('/delete-img/:id',uploadImageCtrl.deleteImages)
module.exports = router