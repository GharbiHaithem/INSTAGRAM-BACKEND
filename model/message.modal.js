const mongoose = require('mongoose')
const schemaMessage= new mongoose.Schema({
    chatId : {type:String},
    senderId:{
        type:String
    },
    text:{
        type:String
    }
},{
    timestamps:true
})
module.exports = mongoose.model('Message',schemaMessage)