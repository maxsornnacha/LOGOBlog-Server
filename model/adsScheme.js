const mongoose = require('mongoose')


//Schema Registration form of member
const adsSchema = new mongoose.Schema({
    image:{
        type:String,
        required:true,
        unique:true
    },
    topic:{
        type:String,
    },
    description:{
        type:String,
    }

    
},{timestamps:true})

module.exports = mongoose.model("Ads",adsSchema)