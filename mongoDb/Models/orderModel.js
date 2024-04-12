
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
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
        enum: ['Pending','outForDelivery','Placed'],
        default:'Pending',
        required:true
    }
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;