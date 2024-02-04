const Ads = require('../model/adsScheme')
const cloudinary = require('cloudinary');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.COULDINARY_API_SECRET 
  });


//โชว์ข้อมูลของ account ทั้งหมด
exports.advertisings = async (req,res)=>{
    Ads.find().exec()
    .then((ads)=>{
        res.json(ads)
    })
    .catch((err)=>{
        res.status(404).json({error:err})
    })
   
}

exports.createAds = async (req,res)=>{


    let image = ''

    const {topic,description} = req.body
   
    //บันทึกภาพลงcloud
    if(req.body.adsImg){
        await cloudinary.uploader.upload(req.body.adsImg,
            { public_id: Date.now()},
            function(error, result){console.log(result); })
            //บันทึกURL รูปภาพลง mongoDB
            .then((result)=>image=result.url)
            .catch((err)=>{
                console.log(err)
                res.status(404).json({error:"การบันทึกภาพล้มเหลว โปรดลองใหม่อีกครั้ง"})
        })
    }

     //บันทึกข้อมูล
     Ads.create({image,topic,description})
     .then((blog)=>{
         res.json(blog)
     })
     .catch((err)=>{
        console.log(err)
         res.status(400).json({error:"กรุณาแทรกรูปภาพโฆษณา"})
     })
   

}

//แสดงโฆษณาแบบเดี่ยว
exports.singleAdvertisement = async (req,res)=>{
    const {id} = req.params
    
   await Ads.findOne({_id:new ObjectId(id)}).exec()
    .then((ads)=>{
        res.json(ads)
   })
    .catch((err)=>{
        res.status(404).json({error:err})
    })
}

//แก้ไข/อัพเดต โฆษณา
exports.editAds = async (req,res)=>{
    const {topic,description,id} = req.body

    let image = ''
     //บันทึกภาพลงcloud
     if((req.body.adsImg).length > 500){
        await cloudinary.uploader.upload(req.body.adsImg,
            { public_id: Date.now()},
            function(error, result){console.log(result); })
            //บันทึกURL รูปภาพลง mongoDB
            .then((result)=>image=result.url)
            .catch((err)=>res.status(404).json({error:"การบันทึกภาพล้มเหลว โปรดลองใหม่อีกครั้ง"}))
     }else{
        image = req.body.adsImg
    }


    try {
        const updatedBlog = await Ads.findOneAndUpdate({_id:new ObjectId(id)},{$set:{
        image,topic,description
    }},{
        new:true,
        useFindAndModify:false
    })

    if(updatedBlog){
        res.json({ status: 'อัพเดตโฆษณาเรียบร้อย', updatedBlog });
    } else {
      res.status(404).json({ status: 'หาโฆษณาไม่พบ' });
    }
    }catch{
        res.json({status:'อัพเดตโฆษณาไม่สำเร็จ'})
    }

}

//ลบโฆษณา
exports.deleteAds = async (req,res)=>{
    const {id} = req.params
try{
    const deleteAds = await Ads.findByIdAndDelete({_id:new ObjectId(id)})

    if(deleteAds){
        res.json({status:'ลบโฆษณาเรียบร้อย'})
    }else{
        res.json({status:'หาโฆษณาที่จะลบไม่เจอ'})
    }
}catch{
        res.json({status:'ลบโฆษณาไม่สำเร็จ'})
}
}