const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { aiResponseGenrator, genrateVector } = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/vector.service");
const { text } = require("express");


async function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors:{
      origin:"http://localhost:5173",
      credentials:true
    }
  });

  
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      next(new Error("unauthorize user and error occur, no token provided"));
    }

    try {
      const decode = jwt.verify(cookies.token, process.env.JWT_SECRET);

      const user = await userModel.findById(decode.id);

      socket.user = user;

      next();
    } catch (error) {
      next(new Error("unauthorize user and error occur", error));
    }
  });

  io.on("connection", async (socket) => {
    console.log("connect to socket io", socket.id);

    socket.on("ai-message", async (messagepayload) => {
      /* 
      const aiMessage = await messageModel.create({
        user: socket.user._id,
        chat: messagepayload.chat,
        content: messagepayload.content,
        role: "user",
      });

      const messageVector = await genrateVector(messagepayload.content);
      */

      const [aiMessage, messageVector] = await Promise.all([
        messageModel.create({
          user: socket.user._id,
          chat: messagepayload.chat,
          content: messagepayload.content,
          role: "user",
        }),
        genrateVector(messagepayload.content),
      ]);

      await createMemory({
        vertors:messageVector,
        messageId: aiMessage._id,
        metadata: {
          user: socket.user._id,
          chat: messagepayload.chat,
          content: messagepayload.content,
        },
      });

      /* 
      const memory = await queryMemory({
       queryVector:messageVector,
        metadata:{
          user:socket.user._id
        },
        limit:3
      })
      
      const chatHistory = (
        await messageModel.find({
            chat: messagepayload.chat,
      }).sort({ createdAt: -1 }).limit(20).lean()).reverse();
*/

      const [memory, chatHistory] = await Promise.all([
        queryMemory({
          queryVector: messageVector,
          metadata: { user: socket.user._id },
          limit: 3,
        }),
        messageModel
          .find({ chat: messagepayload.chat })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
          .then((res) => res.reverse()), // reverse after fetching
      ]);

      const stm = chatHistory.map((item) => {
        return {
          role: item.role,
          parts: [{ text: item.content }],
        };
      });

      const ltm = [
        {
          role: "user",
          parts: [
            {
              text: `this are some priviose message from the chat ,use them to genrate a reponse
          ${memory.map((item) => item.metadata.content).join("/n")}
          `,
            },
          ],
        },
      ];

      const response = await aiResponseGenrator([...ltm, ...stm]);

      socket.emit("ai-response", {
        content: response,
        chat: messagepayload.chat,
      });

      const [airesponse,responseVector] = await Promise.all([
         messageModel.create({
        user: socket.user._id,
        chat: messagepayload.chat,
        content: response,
        role: "model",
      }),
      genrateVector(response)
      ])

      /* 
      const airesponse = await messageModel.create({
        user: socket.user._id,
        chat: messagepayload.chat,
        content: response,
        role: "model",
      });

      const responseVector = await genrateVector(response);
      */

      await createMemory({
        vertors: responseVector,
        messageId: airesponse._id,
        metadata: {
          user: socket.user._id,
          chat: messagepayload.chat,
          content: response,
        },
      });

     
    });
  });
}

module.exports = initSocketServer;
