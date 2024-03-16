const mongoose =require('mongoose')
const ItemSchema=new mongoose.Schema({
    Itemname:String,
    Price:String,
    productDescription:String
})
module.exports=new mongoose.model('Items',ItemSchema);