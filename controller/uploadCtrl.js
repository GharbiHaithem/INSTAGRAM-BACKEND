const {cloudinarUploadImg,cloudinarDeleteImg}= require('../util/cloudinary')
const fs = require('fs')
const uploadImageCtrl = {
  uploadImages:async(req,res)=>{

    try {
     const uploader = (path)=>cloudinarUploadImg(path,'images')
     const urls=[]
     const files = req.files
     console.log(files)
     for(const file of files){
       const {path} = file
       const newPath = await uploader(path)
       urls.push(newPath)
       fs.unlinkSync(path)
     }
     const images = urls.map((file)=>file) 
    console.log(images)
     res.json(images)
    } catch (error) {
     res.json({message:error.message})
    }
   },
   deleteImages:async(req,res)=>{
     const { id } = req.params
     try {
      const deletedImg = cloudinarDeleteImg(id,"images") 
      res.json({message:"deleted success"})
     } catch (error) {
       res.json({message:error.message})
     }
   }
}
module.exports = {uploadImageCtrl}