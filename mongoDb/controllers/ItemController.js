
const { verifyAccessToken } = require("../helper/jwt_helper");
const Admin=require('../Models/adminModel')
const Item=require('../Models/ItemModel');
const Token = require("../Models/Token");
module.exports.AddItem=async (req,res)=>{
    if (!req.headers["authorization"]) {
        return res.status(400).json({
            success: false,
            message: "User Needs to Login to Perform this Action",
        });
    }
    const fnd = await Token.findOne({ Token: req.headers["authorization"].split(" ")[1] });//
    if (!fnd) {
        return res.status(404).send("Login to Perform this Action");
    }
    const {actualPrice,sellingPrice}=req.body
    const percentage=Math.round(((actualPrice - sellingPrice) / actualPrice) * 100);
    // if(percentage>=100){
    //     return res.status(402).send("there is a error in sending the prices")
    // }
    const item = new Item({
        itemName: req.body.itemName,
        actualPrice,
        sellingPrice,
        itemDescription: req.body.itemDescription,
        percentage: percentage
    });

    try {
        verifyAccessToken(req, res, async (err) => {
            if (err) {
              return res
                .status(401)
                .json({
                  error:
                    "Unauthorized: Invalid access token Login TO get Your Details",
                });
            }
            const userId = req.payload.aud;
            const findAdminId=await Admin.findById(userId)
            if(!findAdminId){
              return res.status(401).json({message:"you are not authorized to see this details"})
            }
        const newItem = await item.save();
        res.status(201).json({message:"new item saved sucessfully",Item:newItem.itemName});
        })
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
module.exports.getItem=async(req,res)=>{
    if (!req.headers["authorization"]) {
        return res.status(400).json({
            success: false,
            message: "User Needs to Login to Perform this Action",
        });
    }
    const fnd = await Token.findOne({ Token: req.headers["authorization"].split(" ")[1] });//
    if (!fnd) {
        return res.status(404).send("Login to Perform this Action");
    }
    try {
        verifyAccessToken(req, res, async (err) => {
            if (err) {
              return res
                .status(401)
                .json({
                  error:
                    "Unauthorized: Invalid access token Login TO get Your Details",
                });
            }
        const data=await Item.find()
        res.send(data)
        })
    } catch (error) {
        res.send("Found the Error")
    }
}
module.exports.updateItem=async(req,res)=>{
    try {
        verifyAccessToken(req, res, async (err) => {
            if (err) {
              return res
                .status(401)
                .json({
                  error:
                    "Unauthorized: Invalid access token Login TO get Your Details",
                });
            }
            const userId = req.payload.aud;
            const findAdminId=await Admin.findById(userId)
            if(!findAdminId){
              return res.status(401).json({message:"you are not authorized to see this details"})
            }
            const {id}=req.params;
        
    const {itemName,actualPrice,sellingPrice,itemDescription}=req.body
    const percentage=Math.round(((actualPrice - sellingPrice) / actualPrice) * 100);
    const data=await Item.findByIdAndUpdate(
        id,
        {
            itemName,
            actualPrice,
            sellingPrice,
            itemDescription,
            percentage:percentage
        },
        { new: true } 
    )
    if(!data){
        return res.status(404).json({ success: false, message: 'Document not found' });
    }
    
    res.json({ success: true, message: 'Document updated successfully', data: data });
    })
        
    } catch (error) {
        res.status(404).json({success:false})
        console.log(error)
    }
}
module.exports.deleteItem=async(req,res)=>{
    try {
        verifyAccessToken(req, res, async (err) => {
            if (err) {
              return res
                .status(401)
                .json({
                  error:
                    "Unauthorized: Invalid access token Login TO get Your Details",
                });
            }
            const userId = req.payload.aud;
            const findAdminId=await Admin.findById(userId)
            if(!findAdminId){
              return res.status(401).json({message:"you are not authorized to see this details"})
            }
        const {id}=req.params;
    const data = await Item.findByIdAndDelete(id);
    if(!data){
        return res.status(404).json({success: false, message: 'Document not found' })
    }
    res.json({ success: true, message: 'Document deleted successfully', data: data });
})
    } catch (error) {
        console.log(error)
        res.status(404).json({success:false,message: 'error found'})
    }
}
