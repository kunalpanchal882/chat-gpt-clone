const express = require('express')
const {resgisterController,loginController,logoutController} = require('../controllers/auth.controller')

const route = express.Router()

route.post('/register',resgisterController)
route.post('/login',loginController)
route.post('/logout',logoutController)

module.exports = route