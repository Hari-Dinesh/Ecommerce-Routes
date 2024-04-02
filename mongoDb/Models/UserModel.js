const mongoose=require('mongoose')
const userschema=new mongoose.Schema({
    Name:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        require:true
    },
    Phone:{
        type:String,
        require:true,
        unique: true
    },
    Address:{
        type:String,
        require:true
    },
    Gender:{
        type: String,
        enum: ['male', 'female'],
        default:'male'
    },
    Password:{
        type:String,
        require:true
    },
    verification:{
        type:Boolean,
        default:false
    }
})
module.exports=mongoose.model('user',userschema);
