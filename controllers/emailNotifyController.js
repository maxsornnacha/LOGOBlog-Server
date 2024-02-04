const Emails = require('../model/emailNotifySchema')




exports.CreatingEmail = async(req,res)=>{
    const {email} = req.body
    console.log(email)
    if(email.length === 0){
        res.status(400).json({error:'กรุณากรอกอีเมล'})
    }
    else{
       Emails.create({email})
       .then((email)=>{
        res.json(email)
        })
        .catch((err)=>{
        res.status(400).json({error:`มีอีเมล '${email}' อยู่ในระบบแล้ว`})
    })
    }
}