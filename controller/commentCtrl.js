const Comment = require('../model/comment')
const Post = require('../model/post.model')
const commentCtrl = {
    createComment: async (req, res) => {
        try {
            const { postId, content, tag, reply } = req.body
            const newcom = new Comment({
                user: req.user.id,
                postId,
                content,
                tag,
                reply
            })
            const updatePost = await Post.findOneAndUpdate({ _id: postId }, { $push: { comments: newcom._id } }, { new: true })
            const savedcom = await newcom.save()
            res.json(savedcom)
        } catch (error) {
            res.json({ message: error.message })
        }
    },
    getComments: async (req, res) => {
        try {
            const allComm = await Comment.find().populate("like user")
            res.json(allComm)
        } catch (err) {
            res.json({ message: err.message })
        }
    }
}
module.exports = commentCtrl