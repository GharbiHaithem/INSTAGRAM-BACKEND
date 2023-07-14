const cloudinary = require("cloudinary")
cloudinary.config({
    cloud_name: "dblkrot85",
    api_key: "786779564615498",
    api_secret: "0wDogjHc7uDzx7Rg847GEeC2Xu0"
})
const cloudinarUploadImg = async(filesUpload)=>{
    console.log({aaaaaa:filesUpload});
    return new Promise((resolve)=>{
        cloudinary.uploader.upload(filesUpload,(result)=>{
   
                console.log({result:result})
            resolve({
                url:result.secure_url,
                asset_id:result.asset_id,
                public_id:result.public_id
            },{
                resource_type: "video",
                format: "mp4",
                eager: [
                  { width: 300, height: 300, crop: "fill", format: "jpg" }
                  // Add any additional transformations or formats you require
                ]
              },) 
            
        })
    })
}

const cloudinarDeleteImg = async(filesDelete)=>{
    return new Promise((resolve)=>{
        cloudinary.uploader.destroy(filesDelete,(result)=>{
            resolve({
                url:result.secure_url,
                asset_id:result.asset_id,
                public_id:result.public_id
            },{
                resource_type:"auto"
            })
        })
    })
}
module.exports = {cloudinarUploadImg,cloudinarDeleteImg}