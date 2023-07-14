const multer =  require('multer') 
const path = require('path')
const fs = require('fs')
const uploadDestination ='public/videos';
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
module.exports = {uploadVideo}