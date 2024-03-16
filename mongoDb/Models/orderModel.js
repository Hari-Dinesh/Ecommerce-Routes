const mongoose=require('mongoose')
const {Schema}=mongoose;
const UserOrders=new Schema({
    Phone:{
        type:String,
        unique:true
    },
    status:String,
    Adress:String,
    Total_price:String,
    Order_date:String,
    orderdata:{
        type:Array,
        required:true
    }

})
module.exports=mongoose.model('Orders',UserOrders)