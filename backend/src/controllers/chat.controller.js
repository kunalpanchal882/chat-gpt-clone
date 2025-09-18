const chatModel = require('../models/chat.model')
const messageModel = require('../models/message.model')
async function chatController(req,res) {
    const {title} = req.body
    const user = req.user

    const chat = await chatModel.create({
        user:user._id,
        title
    })

    res.status(201).json({
        message:"chat create succesfully",
        chat
    }) 
}

async function getChatController(req,res) {
       const user  = req.user
       const chats = await chatModel.find({user:user._id})

       res.status(200).json({
        message:"chat fetch succesfully",
        chats:chats.map(chat => ({
            _id:chat._id,
            title:chat.title,
            lastActivity: chat.lastActivity,
            user:chat.user
        }))
       })
}

async function getMessageController(req,res) {
    const chatId = req.params.id

    const messages = await messageModel.find({chat:chatId}).sort({createdAt:1})

    res.status(200).json({
        message:"message fetch succesfully",
        messages:messages
    })

}


module.exports = {
    chatController,
    getChatController,
    getMessageController
}