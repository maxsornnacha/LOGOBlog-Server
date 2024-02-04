const {advertisings,createAds,singleAdvertisement,editAds,deleteAds} = require('../controllers/adsController')
const express = require('express')
const router = express.Router()
const {AuthenticalToken} = require('../controllers/authController')


router.get('/ads',advertisings)  //แสดงโฆษณา
router.get('/ads/single/:id',singleAdvertisement) //แสดงโฆษณาแบบเดี่ยว
router.post('/createAds',AuthenticalToken,createAds) //สร้างโฆษณา
router.put('/editAds',AuthenticalToken,editAds) //แก้ไข/อัพเดตโฆษณา
router.delete('/adsDelete/:id',AuthenticalToken,deleteAds)

module.exports = router
