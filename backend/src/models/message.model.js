const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"authUsers"
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"chat"
    },
    content:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","model","sytum"],
        default:"user"
    }
},{
    timestamps:true
})

const messageModel = mongoose.model('message',messageSchema,"messages")

module.exports = messageModel