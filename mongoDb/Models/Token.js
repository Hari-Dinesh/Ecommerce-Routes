const mongoose=require('mongoose')
const Tokenschema=new mongoose.Schema({
    UserId:{
        type:String,
        require:true
    },
    Token:{
        type:String,
        require:true
    }
})
module.exports=mongoose.model('Tokens',Tokenschema)