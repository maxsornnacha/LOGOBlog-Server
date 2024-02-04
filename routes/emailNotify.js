const {CreatingEmail} = require('../controllers/emailNotifyController')
const express = require('express')
const router = express.Router()



router.post('/emailnotification',CreatingEmail)


module.exports = router
