const Post = require('../model/post.model')
const Comment = require('../model/comment')
const postCtrl = {
    createPost : async(req,res)=>{
        const{id} = req.user
        console.log(id)
        try{
         const newPost = await  Post.create({
            description:req.body.description,
            images:req.body.images,
            videos:req.body.videos,
            postedBy:id
         })
         res.json(newPost)
        }catch(err){
         res.json({message:err.messagge}) 
        }
    },
    getAllPosts : async(req,res)=>{
        try{
       const allPosts = await Post.find().populate("likes postedBy").populate("comments").populate({
        path:"comments",
        populate:"user"
       })
       res.status(200).json(allPosts)
        }catch(err){
      res.status(500).json({message:err.message})
        }
    },
    likeDislikePost:async(req,res)=>{
        try{
            console.log(req.user)
           const post = await Post.findById(req.params.id)
       if(!post.likes.includes(req.body.userId)){
        await post.updateOne({$push:{
          likes : req.body.userId
        }})
        res.status(200).json({message:"the post has been liked",datelike:Date.now()})
       }else{
        await post.updateOne({$pull:{
          likes:req.body.userId
        }})
        res.status(200).json({message:"the post has been disliked"})
       }
        }catch(err){
           return res.status(500).json({msg:err.message})
        }
     },
    //  dislikePost:async(req,res)=>{
    //   try{
    //    const isAlreadyLiked = await Post.findById({_id:req.params.id,likes:req.user.id})
    //    if(isAlreadyLiked){
    //     const updatePost = await Post.updateOne({_id:req.params.id},{
    //       $pull:{likes:req.user.id}},{new:true})
    //       console.log(updatePost);
    //       res.json(updatePost)
    //    }else{
    //    res.json({message:"this post does not exist"})
    //    }
    //   }catch(err){

    //   }
    //  }
    deletePost:async(req,res)=>{
      const{id} = req.params
      try {
        
        const post = await Post.findOneAndRemove({ _id: id, postedBy: req.user.id });
        const comments = await Comment.deleteMany({postId:id})
        if(!post){
    return  res.status(404).json({ error: "Post not found or you are not authorized to delete it." });
       }
        return res.json({post,comments})
      
      } catch (err) {
      return  res.status(500).json({message:err.message})
      }

    }
}
module.exports = postCtrl