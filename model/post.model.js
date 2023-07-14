const mongoose = require('mongoose')

const PostModel =new mongoose.Schema({
 description:{
    type:String,
    required:true
 },
 images:[{
    public_id:String,
    url:String
}],
videos:[{
    public_id:String,
    url:String
}],
 postedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
,
likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
comments:[{type:mongoose.Schema.Types.ObjectId,ref:'Comment'}],
},

{
    timestamps:true
})


module.exports = mongoose.model('Post', PostModel)