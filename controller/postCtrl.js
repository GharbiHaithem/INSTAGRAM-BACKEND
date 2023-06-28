const Post = require('../model/post.model')
const postCtrl = {
    createPost : async(req,res)=>{
        const{id} = req.user
        console.log(id)
        try{
         const newPost = await  Post.create({
            description:req.body.description,
            images:req.body.images,
            postedBy:id
         })
         res.json(newPost)
        }catch(err){
         res.json({message:err.messagge}) 
        }
    },
    getAllPosts : async(req,res)=>{
        try{
       const allPosts = await Post.find().populate("postedBy")
       res.status(200).json(allPosts)
        }catch(err){
      res.status(500).json({message:err.message})
        }
    },
    likePost:async(req,res)=>{
        try{
            console.log(req.user)
           const post = await Post.find({_id:req.params.id,likes:req.user.id})
       if(post.length>0) return res.status(400).json({msg:'You liked Already this post '})
       const like= await Post.findOneAndUpdate({_id:req.params.id},{
        $push:{likes:req.user.id}
       },{new:true})
     if(!like) return res.status(400).json({msg:'this post does not exist'})  
       res.json({
        msg:'liked success',
       like
       })
        }catch(err){
           return res.status(500).json({msg:err.message})
        }
     },
     dislikePost:async(req,res)=>{
      try{
       const isAlreadyLiked = await Post.findById({_id:req.params.id,likes:req.user.id})
       if(isAlreadyLiked){
        const updatePost = await Post.updateOne({_id:req.params.id},{
          $pull:{likes:req.user.id}},{new:true})
          console.log(updatePost);
          res.json(updatePost)
       }else{
       res.json({message:"this post does not exist"})
       }
      }catch(err){

      }
     }
}
module.exports = postCtrl