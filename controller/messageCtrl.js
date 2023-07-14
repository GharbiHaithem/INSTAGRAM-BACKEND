const Message = require('../model/message.modal')
const messageCtrl = {
createMessage:async(req,res)=>{
    try {
        const{chatId,text,senderId} = req.body
        const message = new Message({
            chatId,
            text,
            senderId
        })
        const result  = await message.save()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
},
getMessage : async(req,res)=>{
    try {
        const {chatId} = req.params
       const getMsg = await Message.find({chatId})
       res.status(200).json(getMsg)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

}
module.exports = messageCtrl