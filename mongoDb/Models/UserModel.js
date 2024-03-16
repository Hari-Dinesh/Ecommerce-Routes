const mongoose=require('mongoose')
const userschema=new mongoose.Schema({
    name:String,
    phone:String,
    Adress:String
})
module.exports=mongoose.model('user',userschema);
