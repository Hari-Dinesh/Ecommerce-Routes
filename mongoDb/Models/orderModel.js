const mongoose=require('mongoose')
const {Schema}=mongoose;
const OrderSchema = new Schema({
    UserId: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
    },
    orderdata:{
        type:Array,
    },
    totalPrice: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: String
    },
    PaymentMode:{
        type:String
    },
    Status:{
        type: String,
        enum: ['Pending', 'outForDelivary',"Placed"],
        default:'Pending'
    }
   
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;