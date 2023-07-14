const express = require('express')
const {uploadVideo} = require('../middlware/upload.video')
const{cloudinarUploadVideo} =require('../util/cloudinaryV2')
const{uploadVideoCtrl}=require('../controller/uploadVideoCtrl')
const router = express.Router()
router.post('/upload/video', uploadVideo.array('video',10),uploadVideoCtrl.uploadVideos);
module.exports = router