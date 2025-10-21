const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')



async function resgisterController(req,res) {
    const {fullname:{firstname,lastname},email,password} = req.body

    const isUSerAlreadyExist = await userModel.findOne({email})

    if(isUSerAlreadyExist){
       return  res.status(409).json({
            message:"user is already register"
        })
    }

    const hashPassword = await bcrypt.hash(password,10)

    const user = await userModel.create({
        email,
        fullname:{
            firstname,
            lastname
        },
        password:hashPassword
    })

    const token = jwt.sign({
        id:user._id
    },process.env.JWT_SECRET)

    res.cookie("token",token)

    res.status(201).json({
        message:"user register succesfully",
        email:user.email,
        fullname:user.fullname,
        id:user._id
    })

}

async function loginController(req,res) {
    const {email,password} = req.body

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(401).json({
            message:"invalid username and password"
        })
    }

    const isPasswordValid =await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(401).json({
            message:"invalid password"
        })
    }

    const token = jwt.sign({
        id:user._id
    },process.env.JWT_SECRET)

    res.cookie('token',token)

    res.status(201).json({
        message:"user loged in succesfully",
        user:{
            email:user.email,
            id:user._id
        }
    })
}

async function logoutController(req,res) {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
}


module.exports = {
    resgisterController,
    loginController,
    logoutController
}