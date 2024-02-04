const  express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const bodyParser = require('body-parser');


const blog = require('./routes/blog')
const login = require('./routes/authBlog')
const registration = require('./routes/regis')
const account = require('./routes/account')
const advertisement = require('./routes/advertisement')
const email = require('./routes/emailNotify')

const app = express()

//connect cloud database
mongoose.connect(process.env.DATABASE)
.then(()=>{
    console.log('connected completely to the database')
})
.catch((err)=>{
    console.log(err)
})

//middleware
//เพิ้มพื้นที่อัพโหลด
app.use(bodyParser.json({ limit: '5mb' })); 
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))
app.use(cookieParser())


//encoded
app.use(express.urlencoded({extended:true}))

//route
app.use('/api',blog)
//auth route 
app.use('/api',login)
//regis route
app.use('/api',registration)
//account route
app.use('/api',account)
//advertisements route
app.use('/api',advertisement)
//emailNotification route
app.use('/api',email)



const port = process.env.PORT || 8080
app.listen(port,()=>{
    console.log(`server is running in port:${port}`)
})