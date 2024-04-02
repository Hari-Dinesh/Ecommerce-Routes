const {AddItem, getItem,deleteItem,updateItem}=require('../controllers/ItemController')
const router = require("express").Router();
router.post('/addnewItem',AddItem)
router.post('/getItem',getItem)
router.post('/updateItem/:id',updateItem)
router.delete('/deleteItem/:id',deleteItem)
module.exports=router