const express = require('express')
const genrateAiImage = require('../controllers/image.controller')
const route = express.Router()
const multer = require('multer')
const {userMiddleware} = require('../middleware/user.middleware')
const upload = multer({storage:multer.memoryStorage()})

route.post('/',userMiddleware,upload.single("image"),genrateAiImage.genratedcaptions)

module.exports = route