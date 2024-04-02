const {usersSigin,userLogin,refreshToken,logout,verify,adminCreate,adminLogin,notification}=require('../controllers/usersController')
const router = require("express").Router();
router.post('/createuser',usersSigin)//
router.post('/login',userLogin)
router.post('/refreshToken',refreshToken)
router.post('/logout',logout)
router.get('/:id',verify)
router.post('/admincreate',adminCreate)
router.post('/adminlogin',adminLogin)
router.post('/xyz',notification)
module.exports=router