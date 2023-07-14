const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dblkrot85',
  api_key: '786779564615498',
  api_secret: '0wDogjHc7uDzx7Rg847GEeC2Xu0'
});
const cloudinarUploadVideo = async (fileUpload) => {
    console.log({ aaaaaa: fileUpload });
  
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        fileUpload,
        {
          resource_type: "video",
          eager: [
            { width: 300, height: 300, crop: "fill", format: "mp4" }
            // Ajoutez toutes les transformations ou formats supplémentaires dont vous avez besoin
          ],
        },
        (error, result) => {
          if (error) {
            console.error(error);
            reject(error);
          } else {
            console.log({ result: result });
            resolve({
              url: result.secure_url,
              asset_id: result.asset_id,
              public_id: result.public_id,
            });
          }
        }
      );
    });
  };
  
  
module.exports={cloudinarUploadVideo}