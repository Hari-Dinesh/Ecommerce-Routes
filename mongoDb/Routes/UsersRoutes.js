const {usersSigin,userLogin,refreshToken,logout}=require('../controllers/usersController')
const router = require("express").Router();
router.post('/createuser',usersSigin)//
router.post('/login',userLogin)
router.post('/refreshToken',refreshToken)
router.post('/logout',logout)
module.exports=router