const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')

/*routes */
const authRoute = require('./routes/auth.route')
const chatRoute = require('./routes/chat.route')
const imageRoute = require('../src/routes/image.route')

const app = express()

/*middlewares*/
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname,'../public')));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))


/*use routes*/
app.use('/auth',authRoute)
app.use('/chat',chatRoute)
app.use('/image',imageRoute)


app.get("*name",(req,res) => {
    res.sendFile(path.join(__dirname,"../public/index.html"))
})

module.exports = app