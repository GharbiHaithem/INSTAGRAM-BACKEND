const mongoose = require('mongoose')
const schemaChat = new mongoose.Schema({
    members : {
        type:Array
    }
},{timestamps:true})
module.exports = mongoose.model('Chat' , schemaChat)