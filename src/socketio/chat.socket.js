const { Server } = require("socket.io");
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const aiResponseGenrator = require('../services/ai.service')
const messageModel = require('../models/message.model')

async function initSocketServer(httpServer ) {
    
    const io = new Server(httpServer, { /* options */ });

    io.use(async (socket,next) => {
          const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

          
          if(!cookies.token){
            next(new Error("unauthorize user and error occur, no token provided"))
          }
          
          try {
            const decode = jwt.verify(cookies.token,process.env.JWT_SECRET)

            const user = await userModel.findById(decode.id)

            socket.user = user

            next()

          } catch (error) {
            next(new Error("unauthorize user and error occur",error))
          }
    })

    io.on("connection",async (socket) => {
        console.log("connect to socket io",socket.id);

        socket.on("ai-message",async(messagepayload) => {

          await messageModel.create({
            user:socket.user._id,
            chat:messagepayload.chat,
            content:messagepayload.content,
            role:"user"
          })

          const chatHistory = (await messageModel.find({
            chat:messagepayload.chat
          }).sort({createdAt:-1}).limit(20).lean()).reverse()

          

          console.log(chatHistory);
          

          const response = await aiResponseGenrator(chatHistory.map((item) => {
            return {
              role:item.role,
              parts:[{text:item.content}]
            }

          }))

          console.log(response);

           await messageModel.create({
            user:socket.user._id,
            chat:messagepayload.chat,
            content:response,
            role:"model"
          })
          
          socket.emit("ai-response",{
            content:response,
            chat:messagepayload.chat
          })
          

        })
        
    });

}

module.exports = initSocketServer
