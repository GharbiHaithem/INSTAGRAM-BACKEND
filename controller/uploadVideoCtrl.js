const { cloudinarUploadVideo } = require("../util/cloudinaryV2");
const fs = require('fs')
const uploadVideoCtrl = {
    uploadVideos: async (req, res) => {
        try {
            const uploader = (path)=>cloudinarUploadVideo(path,'videos')
        
            const urls=[]
            const files = req.files
            console.log({files:files})
            for(const file of files){
                console.log(file)
              const {path} = file
              const newPath = await uploader(path)
   console.log({"newPath":newPath})
              urls.push(newPath)
              console.log({url:urls})
              fs.unlinkSync(path)
            }
            const images = urls.map((file)=>file) 
           console.log(images)
            res.json(images)
           } catch (error) {
            res.json({message:error.message})
           }
          },
         
  };
  module.exports = {uploadVideoCtrl}