const jsonWT = require('jsonwebtoken')
const {expressjwt: jwt} = require('express-jwt')
const bcrypt = require('bcrypt')
const Members = require('../model/registrationSchema')
const cookieParser = require('cookie-parser')

//ระบบ Login
exports.Login = (req,res)=>{
  const {username,password} = req.body

  //Members login
  Members.findOne({username}).exec()
  .then((memberData)=>{
     const comparing = bcrypt.compare(password,memberData.password)
     comparing.then(async (status)=>{
        if(status){
          const tokenMember =  await jsonWT.sign({username},process.env.JWT_SECRET_MEMBER,{expiresIn:'1d'})
          res.json({member:username,status:true,image:memberData.userImage,tokenMember:tokenMember})
        }
        else{
          res.status(400).json({error:'รหัสไม่ถูกต้อง!'})
        }
     }).catch((err)=>{
       res.status(400).json({error:'เกิดข้อผิดพลาด123!'})
     })
     
    })
  .catch(()=>{
    //admin Login
  if(username === process.env.ADMIN && password === process.env.PASSWORD){
    const token = jsonWT.sign({username},process.env.JWT_SECRET,{expiresIn:'1d'})
    res.json({token:token,username:username})
  }
  else{
    //res.status(400).json({error:'รหัสไม่ถูกต้อง!'})
    res.status(400).json({error:`รหัสไม่ถูกต้อง!`})
  }
  })
  
}


//ตรวจสอบ Token สำหรับ Admin
exports.AuthenticalToken = jwt({
  secret:process.env.JWT_SECRET,
  algorithms:["HS256"],
  userProperty:"auth"
})

//ตรวจสอบ Token สำหรับ Member
exports.AuthenticalTokenForMember = jwt({
  secret:process.env.JWT_SECRET_MEMBER,
  algorithms:["HS256"],
  userProperty:"auth"
})