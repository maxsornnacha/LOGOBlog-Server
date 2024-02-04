const mongoose = require('mongoose')

//Schema Registration form of member
const emailNotifySchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
 
},{timestamps:true})

module.exports = mongoose.model("EmailsNotification",emailNotifySchema)