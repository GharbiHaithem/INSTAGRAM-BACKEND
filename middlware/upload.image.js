const multer =  require('multer') 
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const uploadDestination = process.env.UPLOAD_DESTINATION || 'public/images';
const multerStorage = multer.diskStorage({
    destination:function(req,file,cb){
// cb(null,path.join(__dirname,'../public/images'))
cb(null, path.join(__dirname,`../${uploadDestination}`));    
},
    filename:function(req,file,cb){
const suffixUnique = Date.now() + "-" + Math.round(Math.random())* 1e9;
cb(null,file.fieldname+ "-" + suffixUnique + ".jpg") 
    }
})
const multerFilter=(req,file,cb)=>{
if(file.mimetype.startsWith('image')){
    cb(null,true)
}else{
    cb({
        message:"unsupported file format"
    })
}
}

const uploadPhoto = multer({
    storage:multerStorage,
    fileFilter:multerFilter,
   
})
const productImgResize = async(req,res,next)=>{
  try{
    if(!req.files) return next()
    await Promise.all(
        req.files.map(async(file)=>{
            await sharp(file.path)
            .toFormat('jpg').toFormat('avif').toFormat('gif')
            .resize(300,300)
            .toFile(`${uploadDestination}/products/${file.filename}`)
            fs.unlinkSync(`${uploadDestination}/products/${file.filename}`)
        })
    )
    next()
  }catch(err){
 console.log(err)
  }
}
const blogImgResize = async(req,res,next)=>{
    if(!req.files) return next()
    await Promise.all(
        req.files.map(async(file)=>{
            await sharp(file.path)
            .toFormat('jpg')
            .resize(300,300)
            .toFile(`public/images/blogs/${file.filename}`)
            fs.unlinkSync(`public/images/blogs/${file.filename}`)
        })
    )
    next()
}
module.exports = {uploadPhoto,productImgResize,blogImgResize}