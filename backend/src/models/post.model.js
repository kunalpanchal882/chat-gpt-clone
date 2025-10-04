const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    image:String,
    caption:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"authUser"
    }
})

const postModel = mongoose.model("userPost",postSchema,"userPosts")

module.exports = postModel

