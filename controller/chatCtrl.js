const Chat = require('../model/chat.model')
const chatCtrl = {
createChat : async(req,res)=>{
    try {
        const {senderId,receiptId} = req.body
        const chat =  new Chat({
            members:[senderId,receiptId]
        })
        const result = await chat.save()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
},
userChat :async(req,res)=>{
    try {
        const userchat = await Chat.find({members: {$in:[req.params.userId]}})
        res.status(200).json(userchat)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
},
findchat:async(req,res)=>{
    try {
        const chatFind = await Chat.findOne({
            members:{$all : [req.params.firstId,req.params.secondId]}
        })
        res.status(200).json(chatFind)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
},
}
module.exports = chatCtrl