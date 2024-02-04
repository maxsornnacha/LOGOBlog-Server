const slugify = require('slugify')
const Blogs = require('../model/blogSchema')
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary');
const base64Validator = require('../modules/modules')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.COULDINARY_API_SECRET 
});


//สร้างข้อมูล
exports.create= async (req,res)=>{

    const {title,content,author,username,types,accoutimage} = req.body
    let slug = slugify(title)
    //types = req.body.types

    
   

    //กรณี title เป็นภาษาไทย
    if(slug === ''){
    slug = uuidv4()
    }

    //ตรวจสอบความถูกต้องของข้อมูล
    if(title === ""){
            res.status(400).json({error:"กรุณาป้อนชื่อบทความ"});
        }
    else if(content === ""){
            res.status(400).json({error:"กรุณาป้อนเนื้อหา"});
        }
    else if(types.length < 1){
        res.status(400).json({error:"กรุณาป้อนประเภทบทความ"});
    }
    else{
        
        let image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/A_black_background.jpg/800px-A_black_background.jpg?20170209161534'
        const rating = [{ratingScore:0,ratingName:req.body.username}]
        //บันทึกภาพลงcloud
        if(req.body.imgfile){
            await cloudinary.uploader.upload(req.body.imgfile,
                { public_id: Date.now()},
                function(error, result){console.log(result); })
                //บันทึกURL รูปภาพลง mongoDB
                .then((result)=>image=result.url)
                .catch((err)=>res.status(404).json({error:"การบันทึกภาพล้มเหลว โปรดลองใหม่อีกครั้ง"}))
        }

        //บันทึกข้อมูล
        Blogs.create({title,content,author,username,slug,types,image,accoutimage,rating})
        .then((blog)=>{
            res.json(blog)
        })
        .catch((err)=>{
            res.status(400).json({error:"มีชื่อบทความซ้ำกัน"})
        })
    }
    }

//ดึงข้อมูลบทความทั้งหมด
exports.blogsShow =  (req,res)=>{
     Blogs.find().exec()
    .then((blogs)=>{
        res.json(blogs)
    })
    .catch((err)=>{
        res.status(404).json({error:err})
    })
   
}

//ดึงข้อมูลโดยอ้างอิงจาก Username|ผู้แต่ง
exports.blogsUsername = (req,res)=>{
    const {username} = req.params

    Blogs.find({username:username}).exec()
   .then((blogs)=>{
       res.json(blogs)
   })
   .catch((err)=>{
       res.status(404).json({error:err})
   })
  
}

//ดึงข้อมูลแบบ1 
exports.singleBlog = (req,res)=>{
   Blogs.findOne({slug:req.params.slug}).exec()
   .then((blog)=>{
        res.json(blog)
   })
   .catch((err)=>{
        res.json({error:err})
   })
}

//ลบข้อมูล
exports.deleteBlog = (req,res)=>{
   Blogs.findByIdAndDelete(req.params.id)
   .then(res.json({status:'ลบบทความเรียบร้อย'}))
   .catch(res.json({status:'ลบบทความไม่สำเร็จ'}))
}



//อัพเดตข้อมูล
exports.updateBlog = async (req,res)=>{

    const author = req.body.author === ''?'ไม่ระบุตัวตน':req.body.author

    //ต้องใส่ title,content และ ชนิดบทความ
    if((req.body.title).length === 0){
        res.status(400).json({error:'กรุณาป้อนชื่อบทความ'})
    }
    else if((req.body.content).length === 0){
        res.status(400).json({error:'กรุณาป้อนรายละเอียด'})
    }
    else if((req.body.types).length === 0){
        res.status(400).json({error:'กรุณาป้อนประเภทบทความ'})
    }
else{

    try {

         //บันทึกภาพลงcloud
    let image = ''
    if((req.body.imgfile).length > 500){
        await cloudinary.uploader.upload(req.body.imgfile,
            { public_id: Date.now()},
            function(error, result){console.log(result); })
            //บันทึกURL รูปภาพลง mongoDB
            .then((result)=>image=result.url)
            .catch((err)=>res.status(404).json({error:"การบันทึกภาพล้มเหลว โปรดลองใหม่อีกครั้ง"}))
        console.log('1',image)
     }else{
        image = req.body.imgfile
        console.log('2',image)
    }

        const updatedBlog = await Blogs.findOneAndUpdate({slug:req.params.slug},{$set:{
        title:req.body.title,
        content:req.body.content,
        author:author,
        types:req.body.types,
        image:image
    }},{
        new:true,
        useFindAndModify:false
    })

    if(updatedBlog){
        res.json({ status: 'อัพเดตบทความเรียบร้อย', updatedBlog });
    } else {
      res.status(404).json({ status: 'บทความไม่พบ' });
    }
    }catch{
        res.status(400).json({error:'มีชื่อบทความซ้ำกัน'})
    }

}
}



//อัพ Comment ลงไปใน dataBase
exports.addComment = (req,res)=>{
    Blogs.findOneAndUpdate(
        { slug: req.params.slug },
        { $push: { comments: { comment:req.body.comment , name:req.body.name } } },
        { new: true }
    )
    .then(res.json({status:'เพิ่มคอมเม้นต์สำเร็จ'}))
    .catch(res.json({status:'เพิ่มคอมเม้นต์ล้มเหลว'}))
}

//ลบ comment ในฐานข้อมูล
exports.deleteComment = (req,res)=>{

    const slug = req.params.slug
    const index =req.body.index

    Blogs.findOne({ slug: slug })
    .then((blog)=>{
        if(index >= 0 && index < blog.comments.length){
            blog.comments.splice(index,1)
            return blog.save()
        }else{
            res.status(400).json({error:'ลบข้อมูลไม่สำเร็จ'})
        }
    })

    .then(()=> {res.json({ status: 'ลบคอมเม้นต์สำเร็จ' })})
    .catch(error => {res.json({ status: 'ลบคอมเม้นต์ล้มเหลว' })});

}

//ให้คะแนนบทความ Rating
exports.addRatingScore = (req,res)=>{
    Blogs.findOneAndUpdate(
        { slug: req.params.slug },
        { $push: { rating: { ratingScore:req.body.ratingScore , ratingName:req.body.ratingName } } },
        { new: true }
    )
    .then(res.json({status:'เพิ่มคะแนนสำเร็จ'}))
    .catch(res.json({status:'เพิ่มคะแนนล้มเหลว'}))
}

//แก้ไขคะแนนบทความ Rating
exports.changeRatingScore = (req,res)=>{
    console.log(req.params.slug)
    console.log(req.body.objectId)

    Blogs.findOneAndUpdate(
        {slug: req.params.slug,
        'rating._id': new ObjectId(req.body.objectId)},
        { $set: {'rating.$.ratingScore':req.body.ratingScore}},
        { new: true }
    )
    .then(updatedBlog => {
        if (updatedBlog) {
          res.json({ status: 'แก้ไขคะแนนสำเร็จ', updatedBlog });
        } else {
          res.status(404).json({ status: 'ไม่พบบทความที่ต้องการแก้ไข' });
          console.log('ไม่พบบทความที่ต้องการแก้ไข')
        }
      })
      .catch(error => {
        console.error('Error updating rating score:', error);
        res.status(500).json({ status: 'เกิดข้อผิดพลาดในการแก้ไขคะแนน' });
      });
  
}


//แสดงบทความความของแต่ละประเภท
exports.blogsTypeShow = (req,res)=>{
    
    const type = req.params.type

    Blogs.find({types:{$in:[`${type}`]}}).exec()
   .then((blogs)=>{
      res.json(blogs)
   })
   .catch((err)=>{
       res.status(404).json({message: err.message})
   })
  
}