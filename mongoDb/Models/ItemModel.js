const mongoose =require('mongoose')
const ItemSchema=new mongoose.Schema({
    itemName:String,
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
    itemDescription:String,
    percentage:Number,
})
module.exports=new mongoose.model('Items',ItemSchema);