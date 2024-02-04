const Members = require('../model/registrationSchema')
const cloudinary = require('cloudinary');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const bcrypt = require('bcrypt')

cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.COULDINARY_API_SECRET 
  });


//โชว์ข้อมูลของ account ที่ login ไว้
exports.accountShow = async (req,res)=>{

    Members.findOne({username:req.params.username}).exec()
    .then((blogs)=>{
        res.json(blogs)
    })
    .catch((err)=>{
        res.status(404).json({error:err})
    })
   
}

exports.accountEdit= async (req,res)=>{
    const {firstname,lastname,email,id} = req.body
    let userImage = req.body.userImage
    
   
    if(firstname.length === 0){
        res.status(404).json({error:"การแก้ไขข้อมูลส่วนตัวล้มเหลว 'กรุณาใส่ชื่อจริง'"})
    }
    else if(lastname.length === 0){
        res.status(404).json({error:"การแก้ไขข้อมูลส่วนตัวล้มเหลว 'กรุณาใส่นามสกุล'"})
    }
    else if(email.length === 0){
        res.status(404).json({error:"การแก้ไขข้อมูลส่วนตัวล้มเหลว 'กรุณาใส่อีเมล'"})
    }else{
        //อัพภาพ Account ใหม่
        if(userImage.length > 500){
            await cloudinary.uploader.upload(userImage,
                { public_id: Date.now()},
                function(error, result){console.log(result); })
                //บันทึกURL รูปภาพลง mongoDB
                .then((result)=>userImage=result.url)
                .catch((err)=>{
                    console.log(err)
                    res.status(404).json({error:"การบันทึกภาพล้มเหลว โปรดลองใหม่อีกครั้ง"})
            })
        }

       const UpdataProfile =  Members.findOneAndUpdate({_id:new ObjectId(id)},{
        $set:{
            firstname,lastname,email,userImage
        }
    },{
        new:true,
        useFindAndModify:false
    })
    .then(()=>{return res.json({ status: 'แก้ไขข้อมูลส่วนตัวเรียบร้อย'})})
    .catch(()=>{return res.status(404).json({error:"การแก้ไขข้อมูลส่วนตัวล้มเหลว โปรดลองใหม่อีกครั้ง"})})
    
    }


}


exports.changePassword = async(req,res)=>{

     //modul password อย่างน้อย 8 ตัว ต้องมีอย่างน้อย ตัวอักษรอัลฟอเบ็ต1ตัวและตัวเลข1ตัว
     const validatePassword=(password)=>{
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
        }

    const {prevPasswordHashed,prevPasswordInput,newPasswordInput,newPasswordConfirmedInput,id} = req.body
     
    if(prevPasswordInput.length === 0){
    res.status(404).json({error:"กรุณาป้อนรหัสผ่านเดิม"})
   }
   else if(newPasswordInput.length === 0){
    res.status(404).json({error:"กรุณาป้อนรหัสผ่านใหม่"})
   }
   else{
    
     //เทียบรหัสผ่านเดิมว่าตรงกันรึป่าว
     let compareStatus = false
     await bcrypt.compare(prevPasswordInput,prevPasswordHashed)
     .then((result)=>{
       compareStatus = result
     })
        //เช็คว่ารหัสผ่านตรงกันหรือไม่
        if(compareStatus){
            if(validatePassword(newPasswordInput)){
                //ยืนยันรหัสผ่าน
                if(newPasswordConfirmedInput === newPasswordInput){
                         //Hash รหัสผ่านก่อนที่จะอัพเดต
                const passwordHashed = await bcrypt.hash(newPasswordInput,10)
                //Updateรหัสผ่าน
                await Members.findByIdAndUpdate({_id:new ObjectId(id)},{
                    $set:{
                        password:passwordHashed
                    }
                },{
                    new:true,
                    useFindAndModify:false
                })
                .then((result)=>res.json({data:'เปลี่ยนรหัสผ่านสำเร็จ'}))
                .catch((err)=>{
                    console.log(err)
                    res.status(400).json({error:'ไม่พบบัญชีที่จะทำการเปลี่ยนรหัสผ่าน'})
                 })

                }else{
                    res.status(404).json({error:"การยืนยันรหัสผ่านใหม่ไม่ตรงกัน"})
                }
            }else{
                res.status(404).json({error:"รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษรขึ้นไป ประกอบด้วยตัวอักษรภาษาอังกฤษและตัวเลขอย่างละ 1ตัวขึ้นไป"})
            }


        }else{
            res.status(404).json({error:"รหัสผ่านเดิมไม่ถูกต้อง"})
        }

   }

}