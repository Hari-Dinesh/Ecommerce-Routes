import mongoose from "mongoose";
const ProductSchema=new mongoose.Schema({
    ProductName:String,
    actualPrice:Number,
    sellingPrice:Number,
    rating:{
        type:Number,
        default:0
    },
    numberOfRatings:{
        type:Number,
        default:0
    },
    numberOfReviews:{
        type:Number,
        default:0
    },
    ProductDescription:String,
    percentage:Number,
})
const Product= mongoose.model('Products',ProductSchema);
export default Product