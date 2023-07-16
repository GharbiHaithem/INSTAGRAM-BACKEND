const { cloudinarUploadVideo } = require("../util/cloudinaryV2");
const fs = require('fs')
const uploadVideoCtrl = {
    uploadVideos: async (req, res) => {
        try {
          const uploader = (path) => cloudinarUploadVideo(path, 'videos');
          const urls = [];
          const files = req.files;
    
          for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path);
            console.log({ newPath });
            urls.push(newPath);
            fs.unlinkSync(path);
          }
    
          const videos = urls.map((file) => file);
          console.log(videos);
    
          res.json(videos);
        } catch (error) {
          res.json({ message: error.message });
        }
      },
         
  };
  module.exports = {uploadVideoCtrl}