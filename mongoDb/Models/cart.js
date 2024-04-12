
import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    UserId: {
        type: String,
        required: true
    },
    Products:{
        type:Array
    }
   
});

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;