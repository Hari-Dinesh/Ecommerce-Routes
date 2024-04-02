const mongoose=require('mongoose')
const adminschema=new mongoose.Schema({
    Email:{
        type:String,
        require:true
    },
    Password:{
        type:String,
        require:true
    },
})
module.exports=mongoose.model('Admin',adminschema);
