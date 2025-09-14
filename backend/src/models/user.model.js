const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullname:{
        firstname:{
            type:String,
            required:true
        },
        lastname:{
            type:String,
            required:true
        }
    },
    password:{
        type:String,
    }
},
{
    timestamps:true
})

const userModel = mongoose.model('authUser',userSchema,'authUsers')

module.exports = userModel