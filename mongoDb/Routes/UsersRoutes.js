const {users}=require('../controllers/usersController')
const router = require("express").Router();
router.post('/createuser',users)
module.exports=router