const express = require('express')
const router = express.Router()
const { Login } = require('../controllers/authController')
const { route } = require('./blog')

// ระบบ Login สร้าง Token ให้ Client ถือเพื่อยืนยันตัวตน
router.post('/login',Login)


module.exports = router