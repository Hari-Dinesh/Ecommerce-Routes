const mongoose=require('mongoose')
const {Schema}=mongoose;
const OrderSchema = new Schema({
    Phone: {
        type: Number,
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
    }
   
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;