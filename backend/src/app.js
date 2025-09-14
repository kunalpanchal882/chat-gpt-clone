const express = require('express')
const cookieParser = require('cookie-parser')
/*routes */
const authRoute = require('./routes/auth.route')
const chatRoute = require('./routes/chat.route')

const app = express()

/*middlewares*/
app.use(express.json())
app.use(cookieParser())


/*use routes*/
app.use('/auth',authRoute)
app.use('/chat',chatRoute)

module.exports = app