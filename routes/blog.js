const express = require('express')
const router = express.Router()
const {create,blogsShow,singleBlog,deleteBlog,updateBlog,addComment,deleteComment,blogsUsername,addRatingScore,changeRatingScore,blogsTypeShow,deleteBlogMember} = require('../controllers/blogController')
const {AuthenticalToken,AuthenticalTokenForMember} = require('../controllers/authController')



//API สำหรับ ดูข้อมูล กับLogin
router.get('/blogs',blogsShow)
router.get('/blogs/type/:type',blogsTypeShow)
router.get('/blog/:slug',singleBlog)
router.get('/blogs/:username',blogsUsername)

//API สำหรับ เพิ่มข้อมูล แก้ไขข้อมูล ลบข้อมูล
//โดยจะมีการล็อค API จนกว่าจะส่ง Token มาถึง Authortize ได้
router.post('/create',AuthenticalToken,create)//admin
router.post('/createForMember',AuthenticalTokenForMember,create)//member
router.delete('/blog/:id',AuthenticalToken,deleteBlog)//admin
router.put('/blog/:slug',AuthenticalToken,updateBlog)//admin
router.put('/blogMember/:slug',AuthenticalTokenForMember,updateBlog)//member
router.delete('/blog/member/:id',AuthenticalTokenForMember,deleteBlog)//member

//API สำหรับคอมเม้น 
router.put('/addComment/:slug',AuthenticalToken,addComment)//admin
router.put('/addCommentForMember/:slug',AuthenticalTokenForMember,addComment)//member
router.put('/deleteComment/:slug',AuthenticalToken,deleteComment)//admin

//API สำหรับให้คะแนน
router.post('/scoregiving/:slug',AuthenticalToken,addRatingScore)//admin
router.post('/scoregivingMember/:slug',AuthenticalTokenForMember,addRatingScore)//member
router.post('/scorechange/:slug',AuthenticalToken,changeRatingScore)//admin
router.post('/scorechangeMember/:slug',AuthenticalTokenForMember,changeRatingScore)//admin


module.exports = router