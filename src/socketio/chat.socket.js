const { Server } = require("socket.io");
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')

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

    io.on("connection", (socket) => {
        console.log("connect to socket io",socket.id);

        
        
    });

}

module.exports = initSocketServer
