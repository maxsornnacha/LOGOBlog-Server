const Members = require('../model/registrationSchema')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary');

          
cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.COULDINARY_API_SECRET 
});


exports.Register = async (req,res)=>{

    //modul password อย่างน้อย 8 ตัว ต้องมีอย่างน้อย ตัวอักษรอัลฟอเบ็ต1ตัวและตัวเลข1ตัว
    const validatePassword=(password)=>{
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
    }
    

    const {username,password,passwordConfirm,email,firstname,lastname} = req.body
    const passwordHashed = await bcrypt.hash(password,10)

    if(firstname === ""){
        res.status(400).json({error:"กรุณาป้อนชื่อจริง"});
    }
    else if(lastname === ""){
        res.status(400).json({error:"กรุณาป้อนนามสกุล"});
    }
    else if(username === "" ){
        res.status(400).json({error:"กรุณาป้อนชื่อผู้ใช้"});
    }
    else if(password === "" ){
        res.status(400).json({error:"กรุณาป้อนรหัสผ่าน"});
    }else if(req.body.passwordConfirm === ""){
        res.status(400).json({error:"กรุณายืนยันรหัสผ่าน"});
    }
    else if(email === "" ){
        res.status(400).json({error:"กรุณาป้อนอีเมล"});
    }
    else if(password === passwordConfirm){
        //confirm ขั้นสุดท้ายให้มี รหัสมีความปลอดภัยมากยิ่งขึ้น
    if(validatePassword(password)){
        let image = 'https://res.cloudinary.com/dakcwd8ki/image/upload/v1705994843/xxrt19gktwya9pcg87x0.png'
    
        //บันทึกภาพลงcloud
        if(req.body.image){
            await cloudinary.uploader.upload(req.body.image,
                { public_id: Date.now()},
                function(error, result){console.log(result); })
                //บันทึกURL รูปภาพลง mongoDB
                .then((result)=>image=result.url)
                .catch((err)=>res.status(404).json({error:"การบันทึกภาพล้มเหลว โปรดลองใหม่อีกครั้ง"}))
        }
        
        Members.create({
            username:username,
            password:passwordHashed,
            firstname:firstname,
            lastname:lastname,
            email:email,
            userImage:image
        })
        .then((data)=>{
            res.json(data)
        })
        .catch((err)=>{
            res.status(400).json({
                error:`มีชื่อผู้ใช้งาน'${username}'อยู่ในระบบแล้ว กรุณากรอกชื่อผู้ใช้ใหม่อีกครั้ง`,
                data:req.body,
                detail:err
            })
            console.log(req.body)
        })
    }else{
        res.status(400).json({error:`รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษรขึ้นไป ประกอบด้วยตัวอักษรภาษาอังกฤษและตัวเลขอย่างละ 1ตัวขึ้นไป`});
    }
    }else{
        res.status(400).json({error:"การยืนยันรหัสผ่านไม่ถูกต้อง กรุณาป้อนรหัสผ่านให้ตรงกัน"});
    }
}

