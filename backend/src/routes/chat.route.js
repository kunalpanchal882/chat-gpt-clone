const express = require('express')
const {chatController,getChatController,getMessageController} = require('../controllers/chat.controller')
const {userMiddleware} = require('../middleware/user.middleware')

const route = express.Router()

route.post('/',userMiddleware,chatController)
route.get('/',userMiddleware,getChatController)
route.get('/message/:id',userMiddleware,getMessageController)

module.exports = route