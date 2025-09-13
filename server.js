require('dotenv').config()
const app = require('./src/app')
const connectDb = require('./src/db/db')
const { createServer } = require("http");
const initSocketServer = require('./src/socketio/chat.socket')


connectDb()

const httpServer = createServer();
initSocketServer(httpServer)


httpServer.listen(3000,() => {
    console.log("server is running on port 3000");
})