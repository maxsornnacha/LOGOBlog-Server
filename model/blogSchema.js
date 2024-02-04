const mongoose = require('mongoose')


//Schema (title),(content),(author),slug(url)
const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true
    },
    author:{
        type:String,
        default:"Admin"
    },
    username:{
        type:String,
        require:true,
        default:"Admin"
    },
    slug:{
        type:String,
        lowercase:true,
        unique:true
    },
    comments:[{comment:String,name:String}],
    types:{
        type:Array,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    accoutimage:{
        type:String,
        required:true
    },
    rating:[{ratingScore:Number,ratingName:String}]
    
},{timestamps:true})

module.exports = mongoose.model("Blogs",blogSchema)