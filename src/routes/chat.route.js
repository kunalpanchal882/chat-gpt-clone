const express = require('express')
const chatController = require('../controllers/chat.controller')
const {userMiddleware} = require('../middleware/user.middleware')

const route = express.Router()

route.post('/',userMiddleware,chatController)

module.exports = route