const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"authUsers",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    lastActivity:{
        type:Date,
        default:Date.now()
    }
})

const chatModel = mongoose.model("chat",chatSchema)

module.exports = chatModel