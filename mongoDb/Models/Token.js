const mongoose=require('mongoose')
const Tokenschema=new mongoose.Schema({
    Token:{
        type:String,
        require:true
    }
})
module.exports=mongoose.model('Tokens',Tokenschema)