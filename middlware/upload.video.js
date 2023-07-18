const multer =  require('multer') 
const path = require('path')
const fs = require('fs')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const uploadDestination =process.env.UPLOAD_VIDEO_DESTINATION || 'public/videos';
const multerStorage = multer.diskStorage({
    destination:function(req,file,cb){
// cb(null,path.join(__dirname,'../public/images'))
cb(null, path.join(__dirname,`../${uploadDestination}`));    
},
filename: function(req, file, cb) {
    const suffixUnique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + suffixUnique + ".mp4");
  }
  
})
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video')) {
      cb(null, true);
    } else {
      cb({
        message: "Unsupported file format"
      });
    }
  };
  const uploadVideo = multer({
    storage:multerStorage,
    fileFilter:multerFilter,
   
})  
const videoResizeMiddleware = (req, res, next) => {
  try {
    if (!req.files) {
      return next();
    }

    // Utilisez Promise.all pour attendre que toutes les opérations de redimensionnement soient terminées
    Promise.all(
      req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const inputPath = file.path;
          const outputPath = `${file.destination}/resized_${file.filename}`;
      console.log(inputPath)
      console.log(outputPath)
      const compressionOptions = [
        '-c:v libx264', // Utiliser le codec vidéo libx264
        '-crf 28', // Facteur de qualité (28 est une valeur de référence, ajustez selon vos besoins)
        '-preset slow', // Présentation de compression (ajustez selon vos besoins)
        '-c:a aac', // Utiliser le codec audio AAC
        '-b:a 128k', // Débit audio (ajustez selon vos besoins)
      ];
      
          // Utilisez fluent-ffmpeg pour redimensionner la vidéo
          ffmpeg(inputPath)
          .outputOptions(compressionOptions)
          .size('1768x720')
          
            .output(outputPath)
            .on('end', () => {
              // Mettez à jour le chemin du fichier pour la suite de la manipulation
              file.path = outputPath;
              resolve();
            })
            .on('error', (err) => {
              console.error('Erreur lors du redimensionnement de la vidéo :', err);
              reject(err);
            })
            .run();
        });
      })
    )
      .then(() => {
        next();
      })
      .catch((err) => {
        console.error('Erreur lors du redimensionnement de la vidéo :', err);
        next(err);
      });
  } catch (err) {
    console.error('Erreur lors du redimensionnement de la vidéo :', err);
    next(err);
  }
};

module.exports = {uploadVideo,videoResizeMiddleware}