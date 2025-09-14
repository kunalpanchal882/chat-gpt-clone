const jwt = require('jsonwebtoken')
const userModel= require('../models/user.model')

async function userMiddleware(req,res,next) {
    const {token} = req.cookies

    if(!token){
        res.status(401).json({
            message:"unauthorizen user"
        })
    }

    try {
        const decode = jwt.verify(token,process.env.JWT_SECRET)

        const user = await userModel.findById({_id:decode.id})

        req.user = user

        next()
         
    } catch (error) {
        res.status(400).json({
            message:"invalid token ,unauthorize user"
        })
    }
    
}

module.exports = {
    userMiddleware
}