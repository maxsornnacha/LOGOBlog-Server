const {Register} = require('../controllers/regisController')
const express = require('express')
const router = express.Router()


router.post('/registration',Register)


module.exports = router


