const {accountShow,accountEdit,changePassword} = require('../controllers/accountController')
const express = require('express')
const router = express.Router()
const {AuthenticalTokenForMember} = require('../controllers/authController')



router.get('/account/:username',AuthenticalTokenForMember,accountShow)
router.put('/profileEdit',AuthenticalTokenForMember,accountEdit)
router.put('/account/changepassword',AuthenticalTokenForMember,changePassword)


module.exports = router


