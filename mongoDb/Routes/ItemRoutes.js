const {AddItem, getItem}=require('../controllers/ItemController')
const router = require("express").Router();
router.post('/addnewItem',AddItem)
router.get('/getitem',getItem)
module.exports=router